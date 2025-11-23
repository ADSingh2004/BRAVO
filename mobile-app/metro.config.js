const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable remote debugging and updates
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
