import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  spotlightArea?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Welcome to SkillBOx!',
    description: 'Let\'s take a quick tour to help you get started with your learning journey.',
    icon: 'hand-right',
  },
  {
    id: 2,
    title: 'Explore Courses',
    description: 'Browse thousands of courses across various categories. Find what interests you most!',
    icon: 'search',
  },
  {
    id: 3,
    title: 'Track Your Progress',
    description: 'View your enrolled courses, track completion, and see your learning achievements.',
    icon: 'analytics',
  },
  {
    id: 4,
    title: 'AI Tutor Assistant',
    description: 'Get instant help with our AI tutor. Ask questions anytime, anywhere!',
    icon: 'bulb',
  },
  {
    id: 5,
    title: 'Your Profile',
    description: 'Manage your account, view certificates, and customize your learning preferences.',
    icon: 'person-circle',
  },
  {
    id: 6,
    title: 'You\'re All Set!',
    description: 'Start exploring and enjoy your learning journey. Happy learning!',
    icon: 'checkmark-circle',
  },
];

interface WelcomeTourProps {
  visible: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

export const WelcomeTour: React.FC<WelcomeTourProps> = ({
  visible,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      // Save preference to not show again
      // AsyncStorage or similar
    }
    onSkip?.();
    onComplete();
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      // Save preference
    }
    onComplete();
  };

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.backdrop}
        />

        {/* Tour Content */}
        <Animated.View
          entering={SlideInDown.duration(400).springify()}
          exiting={SlideOutDown.duration(400)}
          style={styles.container}
        >
          {/* Skip Button */}
          {currentStep < TOUR_STEPS.length - 1 && (
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip Tour</Text>
            </Pressable>
          )}

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.iconGradient}
            >
              <Ionicons name={step.icon} size={56} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {TOUR_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* "Don't Show Again" Checkbox */}
          {currentStep === TOUR_STEPS.length - 1 && (
            <Pressable
              onPress={() => setDontShowAgain(!dontShowAgain)}
              style={styles.checkboxContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  dontShowAgain && styles.checkboxChecked,
                ]}
              >
                {dontShowAgain && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxText}>Don't show this again</Text>
            </Pressable>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#6366F1" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            )}

            <View style={{ flex: 1 }} />

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  skipButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#6366F1',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
