const appConfig = require('./app.json');

module.exports = {
  ...appConfig,
  expo: {
    ...appConfig.expo,
    // Always refresh development certificates
    updates: {
      ...appConfig.expo.updates,
      enabled: true,
      checkAutomatically: 'ON_LOAD',
    },
    // Ensure development client has proper setup
    development: {
      developmentClient: true,
      distribution: 'internal',
    },
    // Enable debugging
    extra: {
      ...appConfig.expo.extra,
      debug: true,
    },
  },
};