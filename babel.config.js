module.exports = function (api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@types': './src/types',
            '@contexts': './src/contexts',
            '@theme': './src/theme',
            '@config': './src/config',
            '@navigation': './src/navigation',
          },
        },
      ],
=======
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind plugin for CSS imports
      'nativewind/babel',
      // Reanimated plugin needs to be listed last
      'react-native-reanimated/plugin',
>>>>>>> 663af87f49b6c2063bb6ee3bd31fe3f2cfba9260
    ],
  };
};
