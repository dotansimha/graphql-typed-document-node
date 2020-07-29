import { readFileSync, readdirSync } from 'fs';
import { join, resolve, extname, parse } from 'path';
import { satisfies } from 'semver';

const { applyPatch } = require('patch-package/dist/applyPatches');
const { getPackageDetailsFromPatchFilename } = require('patch-package/dist/PackageDetails');

export function applyPatchFile(baseDir: string, fileName: string, reverse = false) {
  const packageDetails = getPackageDetailsFromPatchFilename(fileName);

  return applyPatch({
    patchFilePath: resolve(baseDir, fileName),
    patchDir: baseDir,
    packageDetails,
    reverse,
  });
}

export async function applyPatches(rootDirectory: string, reverse = false): Promise<void> {
  const { availablePatches, baseDir } = await getAvailablePatches();
  const packageJson = JSON.parse(readFileSync(join(rootDirectory, './package.json'), 'utf-8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  for (const patch of availablePatches) {
    if (dependencies[patch.packageName] || devDependencies[patch.packageName]) {
      const dependency = dependencies[patch.packageName] || devDependencies[patch.packageName];
      const isValidVersion = satisfies(dependency, patch.versionRange);

      if (isValidVersion) {
        const result = applyPatchFile(baseDir, patch.fileName, reverse);

        if (result) {
          console.info(`[TypedDocumentNode] Patch for ${patch.packageName}@${dependency} has been ${reverse ? 'reversed' : 'applied'}!`);
        } else {
          console.warn(`[TypedDocumentNode] Something went wrong, unable to patch ${patch.packageName} (Patch: ${patch.versionRange}, Installed: ${dependency})`);
        }
      } else {
        console.warn(`[TypedDocumentNode] Patch for ${patch.packageName} exists, but you have a version mismatch! (Supported: ${patch.versionRange}, you have: ${dependency})`);
      }
    }
  }
}

export async function getAvailablePatches() {
  const baseDir = join(__dirname, './patches/');
  const files = readdirSync(baseDir).filter(d => extname(d) === '.patch');

  return {
    baseDir,
    availablePatches: files.map(fileName => {
      const parts = parse(fileName).name.split('+');
      let packageName = null;
      let versionRange = null;

      if (parts.length === 2) {
        packageName = parts[0];
        versionRange = parts[1];
      } else if (parts.length === 3) {
        packageName = `${parts[0]}/${parts[1]}`;
        versionRange = parts[2];
      }

      return {
        fileName,
        packageName,
        versionRange,
      };
    })
  };
}
