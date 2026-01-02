import { ProfilePhotoUpload } from '@/components/auth/ProfilePhotoUpload';
import { Input } from '@/src/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
  'C++', 'Swift', 'Kotlin', 'Go', 'Rust', 'PHP',
  'Web Development', 'Mobile Development', 'Machine Learning', 'Data Science',
  'UI/UX Design', 'Graphic Design', 'Video Editing', 'Photography',
  'Marketing', 'Business', 'Writing', 'Music Production',
];

const GOALS = [
  { id: 'career', label: 'Advance my career', icon: 'trending-up' },
  { id: 'hobby', label: 'Learn for fun', icon: 'happy' },
  { id: 'certificate', label: 'Get certified', icon: 'ribbon' },
  { id: 'business', label: 'Start a business', icon: 'bulb' },
  { id: 'freelance', label: 'Become a freelancer', icon: 'briefcase' },
  { id: 'switch', label: 'Switch careers', icon: 'swap-horizontal' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out', icon: 'leaf' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience', icon: 'trending-up' },
  { id: 'advanced', label: 'Advanced', description: 'Highly skilled', icon: 'star' },
];

const TIME_COMMITMENTS = [
  { id: '15', label: '15-30 min/day' },
  { id: '30', label: '30-60 min/day' },
  { id: '60', label: '1-2 hours/day' },
  { id: '120', label: '2+ hours/day' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Personal Info
  const [profilePhoto, setProfilePhoto] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  // Step 2: Interests & Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Step 3: Learning Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState('');

  // Step 4: Experience Level
  const [experienceLevel, setExperienceLevel] = useState('');

  const progress = (currentStep / totalSteps) * 100;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleComplete = () => {
    // Save profile data
    Alert.alert('Success', 'Profile setup completed!', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepSubtitle}>
              Tell us a bit about yourself
            </Text>

            <ProfilePhotoUpload
              onImageSelected={setProfilePhoto}
              initialImage={profilePhoto}
            />

            <Input
              label="Display Name *"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={setDisplayName}
              icon="person-outline"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{bio.length}/200</Text>
            </View>

            <Input
              label="Location (Optional)"
              placeholder="City, Country"
              value={location}
              onChangeText={setLocation}
              icon="location-outline"
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Interests & Skills</Text>
            <Text style={styles.stepSubtitle}>
              Select topics you're interested in
            </Text>

            <View style={styles.skillsGrid}>
              {SKILLS.map((skill) => (
                <Pressable
                  key={skill}
                  onPress={() => toggleSkill(skill)}
                  style={[
                    styles.skillChip,
                    selectedSkills.includes(skill) && styles.skillChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.skillChipText,
                      selectedSkills.includes(skill) && styles.skillChipTextSelected,
                    ]}
                  >
                    {skill}
                  </Text>
                  {selectedSkills.includes(skill) && (
                    <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Learning Goals</Text>
            <Text style={styles.stepSubtitle}>
              What do you want to achieve?
            </Text>

            <View style={styles.goalsContainer}>
              {GOALS.map((goal) => (
                <Pressable
                  key={goal.id}
                  onPress={() => toggleGoal(goal.id)}
                  style={[
                    styles.goalCard,
                    selectedGoals.includes(goal.id) && styles.goalCardSelected,
                  ]}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={28}
                    color={selectedGoals.includes(goal.id) ? '#6366F1' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedGoals.includes(goal.id) && styles.goalLabelSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>
                  {selectedGoals.includes(goal.id) && (
                    <View style={styles.goalCheckmark}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Daily Time Commitment</Text>
            <View style={styles.timeGrid}>
              {TIME_COMMITMENTS.map((time) => (
                <Pressable
                  key={time.id}
                  onPress={() => setTimeCommitment(time.id)}
                  style={[
                    styles.timeChip,
                    timeCommitment === time.id && styles.timeChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      timeCommitment === time.id && styles.timeTextSelected,
                    ]}
                  >
                    {time.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Experience Level</Text>
            <Text style={styles.stepSubtitle}>
              What's your current skill level?
            </Text>

            <View style={styles.experienceContainer}>
              {EXPERIENCE_LEVELS.map((level) => (
                <Pressable
                  key={level.id}
                  onPress={() => setExperienceLevel(level.id)}
                  style={[
                    styles.experienceCard,
                    experienceLevel === level.id && styles.experienceCardSelected,
                  ]}
                >
                  <Ionicons
                    name={level.icon as any}
                    size={40}
                    color={experienceLevel === level.id ? '#6366F1' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.experienceLabel,
                      experienceLevel === level.id && styles.experienceLabelSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text style={styles.experienceDescription}>
                    {level.description}
                  </Text>
                  {experienceLevel === level.id && (
                    <View style={styles.experienceCheckmark}>
                      <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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
              {currentStep === totalSteps ? 'Complete' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  skillChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  skillChipTextSelected: {
    color: '#FFFFFF',
  },
  goalsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  goalCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
    flex: 1,
  },
  goalLabelSelected: {
    color: '#6366F1',
  },
  goalCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeChip: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  timeChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeTextSelected: {
    color: '#6366F1',
  },
  experienceContainer: {
    gap: 16,
  },
  experienceCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  experienceCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  experienceLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  experienceLabelSelected: {
    color: '#6366F1',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  experienceCheckmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
