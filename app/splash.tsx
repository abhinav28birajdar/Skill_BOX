import { useTheme } from '@/context/EnhancedThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const navigateNext = () => {
    router.replace('/welcome');
  };

  useEffect(() => {
    // Logo entrance animation
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { 
      damping: 10, 
      stiffness: 100,
      mass: 0.5 
    });
    
    // Subtle rotation animation
    logoRotation.value = withSequence(
      withTiming(-5, { duration: 400 }),
      withTiming(5, { duration: 400 }),
      withTiming(0, { duration: 400 })
    );

    // Pulsing effect
    setTimeout(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }, 800);
    
    // Text animation after logo
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 }, () => {
        // Navigate after animations complete
        setTimeout(() => {
          runOnJS(navigateNext)();
        }, 1200);
      });
    }, 600);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value * pulseScale.value },
      { rotate: `${logoRotation.value}deg` }
    ],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textOpacity.value === 0 ? 20 : 0 }],
  }));

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark, colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated Logo */}
        <Animated.View style={[logoAnimatedStyle, styles.logoContainer]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            style={styles.logoBackground}
          >
            <Ionicons name="school" size={80} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
        
        {/* Animated Text */}
        <Animated.View style={[textAnimatedStyle, styles.textContainer]}>
          <Text style={styles.title}>SkillBOx</Text>
          <Text style={styles.tagline}>Learn Today, Lead Tomorrow</Text>
          
          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <Animated.View style={[styles.loadingProgress, textAnimatedStyle]} />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Version Info */}
      <Animated.View style={[textAnimatedStyle, styles.footer]}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    width: 200,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});