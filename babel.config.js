module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind plugin
      'nativewind/babel',
      // Reanimated plugin needs to be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
