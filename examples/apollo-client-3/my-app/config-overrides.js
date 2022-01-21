/* eslint-disable no-param-reassign */
module.exports = function override(config) {
  config.resolve.plugins = config.resolve.plugins.filter(
    (p) => p.constructor.name !== 'ModuleScopePlugin',
  );
  return config;
};