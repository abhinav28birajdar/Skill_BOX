const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix resolver issues and ignore patterns
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'md', 'sql'],
  sourceExts: [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx'],
};

// Fix the regex pattern that's causing the error
config.watchFolders = [path.resolve(__dirname)];

// Ignore problematic directories
config.resolver.blacklistRE = /(__tests__|\.expo|node_modules[\\\/]react[\\\/]dist[\\\/].*|website[\\\/]node_modules[\\\/].*|heapCapture[\\\/]bundle\.js|.*[\\\/]__tests__[\\\/].*)$/;

module.exports = config;
