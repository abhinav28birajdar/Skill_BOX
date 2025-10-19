// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = projectRoot;

/** @type {import('@expo/metro-config').MetroConfig} */
module.exports = (async () => {
  const config = await getDefaultConfig(projectRoot, {
    // Enable CSS support
    isCSSEnabled: true,
  });

  // Add support for additional file types
  config.resolver.assetExts.push('md', 'sql');
  
  const { resolver } = config;

  // Ensure proper source extensions
  resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json'];
  
  // Set the correct resolver fields
  resolver.resolverMainFields = ['react-native', 'browser', 'module', 'main'];
  
  // Keep the hierarchical lookup
  resolver.disableHierarchicalLookup = false;
  
  // Set proper node modules paths
  resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

  // Set cache version
  config.cacheVersion = '2.0';

  // Add watchFolders for monorepos
  config.watchFolders = [workspaceRoot];

  // Enable symlinks
  config.resolver.resolveRequest = require('metro-resolver').resolve;

  return config;
})();