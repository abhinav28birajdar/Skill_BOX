import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { skillCategoriesData } from '../../data/skillCategories';

interface SelectedSkills {
  [key: string]: boolean;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkills>({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const steps = [
    {
      title: 'Welcome to SkillBox',
      subtitle: 'Let\'s personalize your learning experience'
    },
    {
      title: 'Choose Your Role',
      subtitle: 'How do you want to use SkillBox?'
    },
    {
      title: 'Select Your Interests',
      subtitle: 'Pick skills you\'d like to learn or teach'
    },
    {
      title: 'You\'re All Set!',
      subtitle: 'Start your learning journey today'
    }
  ];

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'I want to learn new skills',
      icon: '🎓',
      features: [
        'Access thousands of courses',
        'Track your progress',
        'Get personalized recommendations',
        'Join learning communities'
      ]
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'I want to teach and share knowledge',
      icon: '👨‍🏫',
      features: [
        'Create and sell courses',
        'Build your teaching brand',
        'Analytics and insights',
        'Direct student interaction'
      ]
    }
  ];

  // Get featured skill categories for onboarding
  const featuredCategories = skillCategoriesData.slice(0, 12);

  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  const getSelectedSkillsList = () => {
    return Object.keys(selectedSkills).filter(skill => selectedSkills[skill]);
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      setLoading(true);
      
      const updates = {
        role: (selectedRole === 'teacher' ? 'teacher_pending' : 'student') as 'teacher_pending' | 'student',
        skills: getSelectedSkillsList(),
        updated_at: new Date().toISOString()
      };

      const result = await updateProfile(updates);
      
      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedRole !== null;
      case 2:
        return getSelectedSkillsList().length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.welcomeContent}>
            <Image
              source={require('../../assets/images/onboarding-welcome.png')}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>
              Discover thousands of courses, learn at your own pace, and connect with a community of learners and teachers.
            </Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.rolesContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && styles.roleCardSelected
                ]}
                onPress={() => setSelectedRole(role.id as 'student' | 'teacher')}
              >
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
                <View style={styles.featuresContainer}>
                  {role.features.map((feature, index) => (
                    <Text key={index} style={styles.featureText}>
                      ✓ {feature}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.skillsContainer}>
            <ScrollView 
              contentContainerStyle={styles.skillsGrid}
              showsVerticalScrollIndicator={false}
            >
              {featuredCategories.map((category: any) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.skillCard,
                    selectedSkills[category.name] && styles.skillCardSelected
                  ]}
                  onPress={() => handleSkillToggle(category.name)}
                >
                  <Image
                    source={{ uri: category.icon_url || '' }}
                    style={styles.skillIcon}
                  />
                  <Text style={styles.skillName}>{category.name}</Text>
                  <Text style={styles.skillCategory}>{category.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.skillsFooter}>
              Selected: {getSelectedSkillsList().length} skills
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.completionContent}>
            <Image
              source={require('../../assets/images/onboarding-complete.png')}
              style={styles.completionImage}
              resizeMode="contain"
            />
            <Text style={styles.completionText}>
              Perfect! You're ready to start your learning journey. 
              {selectedRole === 'teacher' 
                ? ' You can begin creating courses and sharing your knowledge.'
                : ' Explore courses tailored to your interests.'
              }
            </Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Your Profile:</Text>
              <Text style={styles.summaryItem}>Role: {selectedRole}</Text>
              <Text style={styles.summaryItem}>
                Interests: {getSelectedSkillsList().slice(0, 3).join(', ')}
                {getSelectedSkillsList().length > 3 && ` +${getSelectedSkillsList().length - 3} more`}
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
        <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
      </View>

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceed() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  roleCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  roleIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  skillsContainer: {
    flex: 1,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  skillCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  skillCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  skillIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  skillCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  skillsFooter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#007AFF',
    marginTop: 10,
    fontWeight: '600',
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});