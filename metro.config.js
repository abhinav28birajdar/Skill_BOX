const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for additional file types
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'md', 'sql'],
  sourceExts: [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx'],
  platforms: ['ios', 'android', 'native', 'web'],
  resolverMainFields: ['react-native', 'browser', 'main'],
  symlinks: false,
};

// Set watch folders
config.watchFolders = [path.resolve(__dirname)];

// Configure transformer
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;