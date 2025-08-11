import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LearningContent, Skill, User } from '@/types/database';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function HomeScreen() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featuredCreators, setFeaturedCreators] = useState<User[]>([]);
  const [trendingContent, setTrendingContent] = useState<LearningContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      // Load featured creators
      const { data: creatorsData } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'creator')
        .eq('is_featured', true)
        .limit(6);
      
      // Load trending content
      const { data: contentData } = await supabase
        .from('learning_content')
        .select(`
          *,
          skills(name),
          users(username, full_name, profile_image_url)
        `)
        .eq('status', 'approved')
        .order('views_count', { ascending: false })
        .limit(10);

      if (skillsData) setSkills(skillsData);
      if (creatorsData) setFeaturedCreators(creatorsData);
      if (contentData) setTrendingContent(contentData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to explore with search query
      Alert.alert('Search', `Searching for: ${searchQuery.trim()}`);
    }
  };

  const handleSkillPress = (skill: Skill) => {
    // Navigate to explore with skill filter
    Alert.alert('Skill Selected', `Exploring ${skill.name}`);
  };

  const handleCreatorPress = (creator: User) => {
    // For now, navigate to explore - we'll create creator profile pages later
    Alert.alert('Creator Selected', `Viewing ${(creator as any).display_name || creator.email}`);
  };

  const handleContentPress = (content: LearningContent) => {
    // For now, navigate to explore - we'll create content detail pages later
    Alert.alert('Content Selected', `Viewing ${content.title}`);
  };

  const renderSkillCard = ({ item }: { item: Skill }) => (
    <TouchableOpacity
      style={styles.skillCard}
      onPress={() => handleSkillPress(item)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.skillImage} />
      ) : (
        <View style={[styles.skillImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.skillName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.skillDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderCreatorCard = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.creatorCard}
      onPress={() => handleCreatorPress(item)}
    >
      {item.profile_image_url ? (
        <Image source={{ uri: item.profile_image_url }} style={styles.creatorImage} />
      ) : (
        <View style={[styles.creatorImage, styles.placeholderAvatar]}>
          <Text style={styles.avatarText}>
            {(item.full_name || item.username || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.creatorName} numberOfLines={1}>
        {item.full_name || item.username}
      </Text>
      {item.bio && (
        <Text style={styles.creatorBio} numberOfLines={2}>
          {item.bio}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderContentCard = ({ item }: { item: LearningContent }) => (
    <TouchableOpacity
      style={styles.contentCard}
      onPress={() => handleContentPress(item)}
    >
      {item.thumbnail_url ? (
        <Image source={{ uri: item.thumbnail_url }} style={styles.contentThumbnail} />
      ) : (
        <View style={[styles.contentThumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderText}>📹</Text>
        </View>
      )}
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.contentMeta}>
          {item.views_count} views • {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.welcomeSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🎓</Text>
            </View>
            
            <ThemedText type="title" style={styles.welcomeTitle}>
              Welcome to SkillBox
            </ThemedText>
            <ThemedText type="subtitle" style={styles.welcomeSubtitle}>
              The Global Ecosystem for Integrated Learning & Instruction
            </ThemedText>
            <ThemedText style={styles.welcomeDescription}>
              Connect with talented creators and acquire creative skills through diverse, 
              high-quality content, live classes, and interactive courses in one dynamic marketplace.
            </ThemedText>
            
            <View style={styles.featuresPreview}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📹</Text>
                <Text style={styles.featureText}>Live Classes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📚</Text>
                <Text style={styles.featureText}>Self-Paced Courses</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>👨‍🏫</Text>
                <Text style={styles.featureText}>Expert Instructors</Text>
              </View>
            </View>
            
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => Alert.alert('Navigation', 'Redirecting to Sign Up...')}
              >
                <Text style={styles.primaryButtonText}>Start Learning Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => Alert.alert('Navigation', 'Redirecting to Sign In...')}
              >
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {skills.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Popular Skills
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                Discover what thousands of learners are studying
              </ThemedText>
              <FlatList
                data={skills.slice(0, 6)}
                renderItem={renderSkillCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.skillsGrid}
              />
              
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => Alert.alert('Navigation', 'Exploring all skills...')}
              >
                <Text style={styles.viewAllButtonText}>Explore All Skills →</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Enhanced Header with search */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <ThemedText type="title" style={styles.headerTitle}>
              Good {getTimeGreeting()}, {user.full_name?.split(' ')[0] || user.username}! 👋
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Ready to learn something new today?
            </ThemedText>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search skills, courses, instructors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading your personalized content...</Text>
          </View>
        ) : (
          <>
            {/* Quick Actions */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Quick Actions
              </ThemedText>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => alert('Skills: Browse all available skills and find what you want to learn next!')}
                >
                  <Text style={styles.quickActionIcon}>🎯</Text>
                  <Text style={styles.quickActionTitle}>Skills</Text>
                  <Text style={styles.quickActionSubtitle}>Discover what to learn</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => alert('Live Classes: Book 1-on-1 sessions, group classes, or workshops with expert instructors!')}
                >
                  <Text style={styles.quickActionIcon}>📹</Text>
                  <Text style={styles.quickActionTitle}>Live Classes</Text>
                  <Text style={styles.quickActionSubtitle}>Book a session</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => alert('Courses: Explore comprehensive courses with structured learning paths and certificates!')}
                >
                  <Text style={styles.quickActionIcon}>📚</Text>
                  <Text style={styles.quickActionTitle}>Courses</Text>
                  <Text style={styles.quickActionSubtitle}>Self-paced learning</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => alert('Creators: Connect with expert instructors and content creators in your field of interest!')}
                >
                  <Text style={styles.quickActionIcon}>�‍🏫</Text>
                  <Text style={styles.quickActionTitle}>Creators</Text>
                  <Text style={styles.quickActionSubtitle}>Follow instructors</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Skill Categories */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Popular Skills
                </ThemedText>
                <ThemedText style={styles.sectionSubtitle}>
                  Trending skills this week
                </ThemedText>
                <FlatList
                  data={skills}
                  renderItem={renderSkillCard}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.skillsGrid}
                />
              </View>
            )}

            {/* Featured Creators */}
            {featuredCreators.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Featured Instructors
                </ThemedText>
                <ThemedText style={styles.sectionSubtitle}>
                  Learn from the best in their fields
                </ThemedText>
                <FlatList
                  data={featuredCreators}
                  renderItem={renderCreatorCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* Trending Content */}
            {trendingContent.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Trending Now
                </ThemedText>
                <ThemedText style={styles.sectionSubtitle}>
                  What other learners are watching
                </ThemedText>
                <FlatList
                  data={trendingContent}
                  renderItem={renderContentCard}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

// Helper function for time-based greeting
const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greetingSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  searchButton: {
    padding: 16,
    backgroundColor: '#007AFF',
  },
  searchButtonText: {
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  skillsGrid: {
    paddingHorizontal: 10,
  },
  skillCard: {
    width: CARD_WIDTH,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  creatorCard: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creatorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  creatorBio: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  contentCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentThumbnail: {
    width: 120,
    height: 80,
  },
  placeholderThumbnail: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    flex: 1,
    padding: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: 12,
    color: '#666',
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
    color: '#fff',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#007AFF',
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  featuresPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  authButtons: {
    width: '100%',
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    marginHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
