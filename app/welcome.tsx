import { OnboardingCarousel } from '@/components/auth/OnboardingCarousel';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { enterDemoMode } = useAuth();

  const handleComplete = () => {
    router.replace('/role-selection');
  };

  const handleSkip = () => {
    router.replace('/role-selection');
  };

  const handleDemoMode = () => {
    enterDemoMode();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <OnboardingCarousel 
        onComplete={handleComplete} 
        onSkip={handleSkip}
        onDemoMode={handleDemoMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});