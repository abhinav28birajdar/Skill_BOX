const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix resolver issues and ignore patterns
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'md', 'sql'],
  sourceExts: [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx'],
  platforms: ['ios', 'android', 'native', 'web'],
  // Add more robust path resolution
  resolverMainFields: ['react-native', 'browser', 'main'],
  symlinks: false,
};

// Fix the regex pattern that's causing the error
config.watchFolders = [path.resolve(__dirname)];

// More specific ignore patterns
config.resolver.blockList = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website[\/\\]node_modules[\/\\].*/,
  /heapCapture[\/\\]bundle\.js$/,
  /.*[\/\\]__tests__[\/\\].*/,
  /\.expo[\/\\].*/,
];

// Add transformer options
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
