// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add support for additional file types
config.resolver.assetExts.push('md', 'sql');

// Ensure proper source extensions
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json'];

// Set the correct resolver fields
config.resolver.resolverMainFields = ['react-native', 'browser', 'module', 'main'];

// Keep the hierarchical lookup
config.resolver.disableHierarchicalLookup = false;

// Set proper node modules paths
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

// Set cache version
config.cacheVersion = '2.0';

module.exports = config;