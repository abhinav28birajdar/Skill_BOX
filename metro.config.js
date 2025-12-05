// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for NativeWind
  isCSSEnabled: true,
});

// Add support for additional file types
config.resolver.assetExts.push('md', 'sql');

module.exports = config;
