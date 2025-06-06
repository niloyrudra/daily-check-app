const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

// allow Firebase’s .cjs files to be picked up
config.resolver.sourceExts.push('cjs');

// disable strict package-exports (otherwise Metro can’t see the CJS entry points)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
