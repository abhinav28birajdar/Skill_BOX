import { OnboardingCarousel } from '@/components/auth/OnboardingCarousel';
import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace('/role-selection');
  };

  const handleSkip = () => {
    router.replace('/role-selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <OnboardingCarousel onComplete={handleComplete} onSkip={handleSkip} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});