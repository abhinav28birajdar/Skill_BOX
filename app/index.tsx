import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import { useAuth } from '../context/AuthContext';
import { seedSkillCategories, skillCategoriesData } from '../data/skillCategories';
import { CourseService } from '../services/courseService';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      initializeApp();
    }
  }, [authLoading]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Try to seed skill categories (will skip if already exists)
      try {
        await seedSkillCategories();
      } catch (error) {
        console.log('Skill categories already seeded or error occurred:', error);
      }
      
      // Load featured courses and categories
      await loadAppData();
      
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppData = async () => {
    try {
      // Load featured courses
      const featured = await CourseService.getFeaturedCourses(6);
      setFeaturedCourses(featured);

      // Load skill categories
      const categories = await CourseService.getSkillCategories();
      setSkillCategories(categories.slice(0, 8)); // Show first 8 categories
      
    } catch (error) {
      console.error('Error loading app data:', error);
      // Use fallback data if database isn't set up yet
      setSkillCategories(skillCategoriesData.slice(0, 8));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppData();
    setRefreshing(false);
  };

  if (authLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading SkillBox...</Text>
      </View>
    );
  }

  // If user is not authenticated, redirect to auth
  if (!user) {
    return <Redirect href="/(auth)/signin" />;
  }

  // If user needs onboarding (no interests selected)
  if (!user.interests || user.interests.length === 0) {
    return (
      <View style={styles.onboardingContainer}>
        <Text style={styles.onboardingTitle}>Welcome to SkillBox!</Text>
        <Text style={styles.onboardingSubtitle}>
          Let's set up your profile to get started
        </Text>
        <TouchableOpacity 
          style={styles.onboardingButton}
          onPress={() => {
            // Navigate to onboarding - for now just redirect to tabs
            Alert.alert('Setup', 'Profile setup coming soon!');
          }}
        >
          <Text style={styles.onboardingButtonText}>Complete Setup</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show role-based dashboard
  if (user.role === 'teacher_approved' || user.role === 'creator' || user.role === 'admin_super' || user.role === 'admin_content' || user.role === 'admin_teacher_ops') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  onboardingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  onboardingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
>>>>>>> 663af87f49b6c2063bb6ee3bd31fe3f2cfba9260
