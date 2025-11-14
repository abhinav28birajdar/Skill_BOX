// Stub for missing expo-brightness
export const Brightness = {
  getBrightnessAsync: async () => 0.5,
  setBrightnessAsync: async (brightness: number) => {},
  getSystemBrightnessAsync: async () => 0.5,
  setSystemBrightnessAsync: async (brightness: number) => {},
  useSystemBrightnessAsync: async () => {},
  isAvailableAsync: async () => false,
  getPermissionsAsync: async () => ({ status: 'granted' as const }),
  requestPermissionsAsync: async () => ({ status: 'granted' as const }),
};
