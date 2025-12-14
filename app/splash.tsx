import { useTheme } from '@/context/EnhancedThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const navigateNext = () => {
    router.replace('/welcome');
  };

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    
    // Text animation after logo
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 600 }, () => {
        // Navigate after animations complete
        setTimeout(() => {
          runOnJS(navigateNext)();
        }, 1000);
      });
    }, 500);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark, colors.secondary]}
      className="flex-1 justify-center items-center"
    >
      <View className="items-center">
        <Animated.View style={logoAnimatedStyle} className="mb-6">
          <View 
            className="w-32 h-32 rounded-3xl items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Text className="text-6xl font-bold text-white">SB</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={textAnimatedStyle}>
          <Text className="text-4xl font-bold text-white mb-2">SkillBox</Text>
          <Text className="text-lg text-white/80 text-center px-8">
            Learn Today, Teach Tomorrow
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}