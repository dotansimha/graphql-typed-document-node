import { readdirSync, readFileSync } from 'fs';
import { join, resolve, extname, basename } from 'path';
import { satisfies } from 'semver';

// eslint-disable-next-line
const verbose = (...args: any[]) => process.env.VERBOSE ? console.log(...args) : undefined;

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type Patch = UnPromisify<ReturnType<typeof getAvailablePatches>>['availablePatches'][0];

const { applyPatch } = require('patch-package/dist/applyPatches');

export function applyPatchFile(baseDir: string, patch: Patch, reverse = false) {
  return applyPatch({
    patchFilePath: resolve(baseDir, patch.fileName),
    patchDir: baseDir,
    packageDetails: patch.details,
    reverse,
  });
}

export async function applyPatches(rootDirectory: string, reverse = false): Promise<void> {
  const { availablePatches, baseDir } = await getAvailablePatches();

  for (const patch of availablePatches) {
    if (patch.details) {
      const packageResolution = resolvePackage(rootDirectory, patch);

      if (packageResolution) {
        const isValidVersion = satisfies(packageResolution, patch.details.version);

        if (isValidVersion) {
          const result = applyPatchFile(baseDir, patch, reverse);

          if (result) {
            // eslint-disable-next-line
            console.info(`[TypedDocumentNode] Patch for ${patch.details.name}@${packageResolution} has been ${reverse ? 'reversed' : 'applied'}!`);
          } else {
            // eslint-disable-next-line
            console.warn(`[TypedDocumentNode] Something went wrong, unable to patch ${patch.details.name} (Patch: ${patch.details.version}, Installed: ${packageResolution})`);
          }
        } else {
          // eslint-disable-next-line
          verbose(`[TypedDocumentNode] Patch for ${patch.details.name} exists, but you have a version mismatch! (Supported: ${patch.details.version}, you have: ${packageResolution})`);
        }
      } else {
        verbose(`[TypedDocumentNode] Skipping ${patch.fileName} patch, didn't find any package resolution!`)
      }
    } else {
      verbose(`[TypedDocumentNode] Unable to extract package details for patch file ${patch.fileName}!`)
    }
  }
}

function resolvePackage(rootDirectory: string, patch: Patch): string | null {
  try {
    const packagePath = require.resolve(`${patch.details.name}/package.json`, { paths: [rootDirectory] });
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    
    return packageJson.version || null;
  } catch (e) {
    return null;
  }
}

export async function getAvailablePatches() {
  const baseDir = join(__dirname, './patches/');
  const files = readdirSync(baseDir).filter(d => extname(d) === '.patch');

  return {
    baseDir,
    availablePatches: files.map(fileName => {
      const cleanName = basename(fileName, extname(fileName));
      const parts = cleanName.split('+');
      const versionRange = parts.pop();
      const name = parts.join('/');

      return {
        fileName,
        details: {
          // This structure and fields are required internally in `patch-package` code.
          version: versionRange,
          name,
          pathSpecifier: name,
          humanReadablePathSpecifier: name,
          packageNames: [name],
        },
      };
    })
  };
}