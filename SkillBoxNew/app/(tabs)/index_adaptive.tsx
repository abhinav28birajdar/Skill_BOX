import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AITutorChat } from '@/components/ai/AITutorChat';
import { BiometricEngagementTracker } from '@/components/biometric/BiometricEngagementTracker';
import { ContentCard, TeacherCard } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { NeuralSkillMap } from '@/components/visualization/NeuralSkillMap';
import { useAI } from '@/context/AIModelContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { LearningContent, User } from '@/types/database';

const { width: screenWidth } = Dimensions.get('window');

export default function AdaptiveHomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isAIEnabled, predictLearningPath, analyzeEngagement } = useAI();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<LearningContent[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [featuredTeachers, setFeaturedTeachers] = useState<User[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSkillMap, setShowSkillMap] = useState(false);
  const [currentLearningPath, setCurrentLearningPath] = useState<string[]>([]);
  const [engagementScore, setEngagementScore] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadData();
    determineTimeOfDay();
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAIEnabled && user) {
      generatePersonalizedRecommendations();
    }
  }, [isAIEnabled, user, engagementScore]);

  const determineTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  };

  const loadData = async () => {
    try {
      setRefreshing(true);
      
      // Load featured content
      const { data: content } = await supabase
        .from('learning_content')
        .select(`
          *,
          skills(name, id)
        `)
        .eq('is_published', true)
        .order('views_count', { ascending: false })
        .limit(10);

      if (content) setRecommendations(content as any);

      // Load featured teachers
      const { data: teachers } = await supabase
        .from('users')
        .select('*')
        .in('role', ['teacher', 'creator'])
        .order('average_rating', { ascending: false })
        .limit(5);

      if (teachers) setFeaturedTeachers(teachers as any);

      // Load skills for neural map
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true);

      if (skills) {
        const processedSkills = (skills as any).map((skill: any, index: number) => ({
          id: skill.id,
          name: skill.name,
          level: Math.random() * 100, // In real app, get from user progress
          x: (index % 5) * 150 + 100,
          y: Math.floor(index / 5) * 150 + 100,
          category: skill.category || 'general',
          prerequisites: [],
          connections: (skills as any).filter((s: any) => s.category === skill.category && s.id !== skill.id).slice(0, 2).map((s: any) => s.id),
          isUnlocked: Math.random() > 0.3,
          isCompleted: Math.random() > 0.7,
          estimatedHours: Math.floor(Math.random() * 50) + 10,
        }));
        setSkillsData(processedSkills);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const generatePersonalizedRecommendations = async () => {
    if (!user || !isAIEnabled) return;

    try {
      // Generate AI-powered learning path
      const defaultCognitiveState = {
        focusLevel: 0.7,
        cognitiveLoad: 0.5,
        emotionalState: 'neutral',
        brainwaveStates: {
          alpha: 0.3,
          beta: 0.4,
          theta: 0.2,
          delta: 0.1
        },
        learningReadiness: 0.8
      };
      const path = await predictLearningPath(user.id, 'general', defaultCognitiveState);
      setCurrentLearningPath(path.nextSteps);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const handleEngagementChange = async (data: any) => {
    setEngagementScore(data.focusScore);
    
    if (isAIEnabled) {
      try {
        const analysis = await analyzeEngagement(data);
        // Use analysis to adapt UI or content
      } catch (error) {
        console.error('Error analyzing engagement:', error);
      }
    }
  };

  const getGreeting = () => {
    const greetings = {
      morning: ['Good morning', 'Rise and shine', 'Ready to learn'],
      afternoon: ['Good afternoon', 'How\'s your day', 'Keep going'],
      evening: ['Good evening', 'Evening learning', 'Wind down with'],
    };
    
    const options = greetings[timeOfDay as keyof typeof greetings];
    return options[Math.floor(Math.random() * options.length)];
  };

  const renderQuickActions = () => (
    <Animated.View style={[
      styles.quickActions,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        backgroundColor: theme.colors.surface,
      }
    ]}>
      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAIChat(!showAIChat)}
      >
        <Text style={styles.quickActionIcon}>🤖</Text>
        <Text style={styles.quickActionText}>AI Tutor</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.accent }]}
        onPress={() => setShowSkillMap(!showSkillMap)}
      >
        <Text style={styles.quickActionIcon}>🧠</Text>
        <Text style={styles.quickActionText}>Skill Map</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.success }]}
        onPress={() => {/* Navigate to AR content */}}
      >
        <Text style={styles.quickActionIcon}>🥽</Text>
        <Text style={styles.quickActionText}>AR/VR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.quickAction, { backgroundColor: theme.colors.secondary }]}
        onPress={() => {/* Navigate to live classes */}}
      >
        <Text style={styles.quickActionIcon}>📺</Text>
        <Text style={styles.quickActionText}>Live</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEngagementInsights = () => (
    <Animated.View style={[
      styles.insightsCard,
      {
        opacity: fadeAnim,
        backgroundColor: theme.colors.surface,
      }
    ]}>
      <Text style={[styles.insightsTitle, { color: theme.colors.text }]}>
        Your Learning Flow
      </Text>
      <View style={styles.insightsGrid}>
        <View style={styles.insightItem}>
          <Text style={[styles.insightValue, { color: theme.colors.primary }]}>
            {Math.round(engagementScore)}%
          </Text>
          <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
            Focus Score
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={[styles.insightValue, { color: theme.colors.success }]}>
            {currentLearningPath.length}
          </Text>
          <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
            Next Steps
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={[styles.insightValue, { color: theme.colors.accent }]}>
            {timeOfDay === 'morning' ? '🌅' : timeOfDay === 'afternoon' ? '☀️' : '🌙'}
          </Text>
          <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>
            Optimal Time
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Biometric Tracker */}
      {isAIEnabled && (
        <BiometricEngagementTracker
          onEngagementChange={handleEngagementChange}
          isActive={true}
          showVisualFeedback={true}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Adaptive Header */}
        <Animated.View style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Learner'}!
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {isAIEnabled ? 'AI-powered learning ready' : 'Ready to explore'}
          </Text>
        </Animated.View>

        {/* AI-Enhanced Search */}
        <Animated.View style={[
          styles.searchContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Ask AI or search content..."
            showSearchIcon={true}
            suggestions={isAIEnabled ? [
              'Explain machine learning',
              'Best React Native practices',
              'Advanced JavaScript concepts',
            ] : []}
            showSuggestions={isAIEnabled}
          />
        </Animated.View>

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Engagement Insights */}
        {isAIEnabled && renderEngagementInsights()}

        {/* Neural Skill Map Preview */}
        {showSkillMap && skillsData.length > 0 && (
          <Animated.View style={[
            styles.skillMapContainer,
            { opacity: fadeAnim, backgroundColor: theme.colors.surface }
          ]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Learning Universe
            </Text>
            <View style={styles.skillMapWrapper}>
              <NeuralSkillMap
                skills={skillsData}
                onSkillPress={(skill) => console.log('Skill selected:', skill)}
                currentSkill={skillsData[0]?.id}
                showConnections={true}
                animated={true}
              />
            </View>
          </Animated.View>
        )}

        {/* AI-Personalized Recommendations */}
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {isAIEnabled ? '🎯 AI Recommendations' : '📚 Featured Content'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map((content) => (
              <ContentCard
                key={content.id}
                title={content.title}
                description={content.description || undefined}
                imageUrl={content.thumbnail_url || undefined}
                duration={`${content.duration_minutes} min`}
                level={content.difficulty_level}
                rating={content.average_rating}
                price={content.price}
                style={styles.contentCard}
                onPress={() => {/* Navigate to content */}}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Teachers */}
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🌟 Expert Mentors
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                name={teacher.full_name || 'Expert Teacher'}
                bio={teacher.bio || undefined}
                rating={teacher.average_rating}
                studentsCount={teacher.total_students}
                style={styles.teacherCard}
                onPress={() => {/* Navigate to teacher */}}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Learning Path Progress */}
        {currentLearningPath.length > 0 && (
          <Animated.View style={[
            styles.section,
            { opacity: fadeAnim, backgroundColor: theme.colors.surface }
          ]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🛤️ Your AI-Generated Learning Path
            </Text>
            {currentLearningPath.map((step, index) => (
              <View key={index} style={styles.pathStep}>
                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.colors.text }]}>
                  {step}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* AI Tutor Chat */}
      {showAIChat && (
        <AITutorChat
          contentContext="general learning"
          onClose={() => setShowAIChat(false)}
          minimized={false}
          onToggleMinimize={() => {}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insightsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentCard: {
    marginRight: 16,
  },
  teacherCard: {
    marginRight: 16,
  },
  skillMapContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillMapWrapper: {
    height: 300,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
});
