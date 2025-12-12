import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  skill_image_url: string | null;
  created_at: string;
  content_count?: number;
  instructor_count?: number;
}

interface SkillStats {
  content_count: number;
  instructor_count: number;
  avg_rating: number;
}

const categories = [
  'all',
  'Technology',
  'Design',
  'Business',
  'Art',
  'Language',
  'Science',
  'Music',
  'Fitness',
  'Cooking',
  'Photography',
  'Writing'
];

const difficultyLevels = [
  'all',
  'beginner',
  'intermediate',
  'advanced'
];

function SkillsScreen() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [skillStats, setSkillStats] = useState<{ [key: string]: SkillStats }>({});

  useEffect(() => {
    loadSkills();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('skills')
        .select('*')
        .order('name', { ascending: true });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty_level', selectedDifficulty);
      }

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading skills:', error);
      } else {
        setSkills(data || []);
        await loadSkillStats(data || []);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSkillStats = async (skillsData: Skill[]) => {
    try {
      const stats: { [key: string]: SkillStats } = {};
      
      for (const skill of skillsData) {
        // Count content for this skill
        const { count: contentCount } = await supabase
          .from('learning_content')
          .select('*', { count: 'exact', head: true })
          .eq('skill_id', skill.id)
          .eq('status', 'published');

        // Count unique instructors for this skill
        const { data: instructorData } = await supabase
          .from('learning_content')
          .select('creator_id', { count: 'exact' })
          .eq('skill_id', skill.id)
          .eq('status', 'published');

        const uniqueInstructors = new Set(instructorData?.map(item => item.creator_id) || []);

        // Get average rating for content in this skill
        const { data: ratingData } = await supabase
          .from('learning_content')
          .select('average_rating')
          .eq('skill_id', skill.id)
          .eq('status', 'published')
          .not('average_rating', 'is', null);

        const avgRating = ratingData && ratingData.length > 0
          ? ratingData.reduce((sum, item) => sum + (item.average_rating || 0), 0) / ratingData.length
          : 0;

        stats[skill.id] = {
          content_count: contentCount || 0,
          instructor_count: uniqueInstructors.size,
          avg_rating: avgRating
        };
      }
      
      setSkillStats(stats);
    } catch (error) {
      console.error('Error loading skill stats:', error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '🔥';
      case 'advanced':
        return '🚀';
      default:
        return '📚';
    }
  };

  const handleSkillPress = (skill: Skill) => {
    // For now, just show skill info in an alert
    const stats = skillStats[skill.id] || { content_count: 0, instructor_count: 0, avg_rating: 0 };
    alert(`${skill.name}\n\n${skill.description || 'Learn this valuable skill!'}\n\nContent: ${stats.content_count} items\nInstructors: ${stats.instructor_count}\nRating: ${stats.avg_rating.toFixed(1)}⭐`);
  };

  const renderSkillCard = ({ item }: { item: Skill }) => {
    const stats = skillStats[item.id] || { content_count: 0, instructor_count: 0, avg_rating: 0 };
    
    return (
      <TouchableOpacity
        style={styles.skillCard}
        onPress={() => handleSkillPress(item)}
      >
        {item.skill_image_url ? (
          <Image source={{ uri: item.skill_image_url }} style={styles.skillImage} />
        ) : (
          <View style={[styles.skillImage, styles.placeholderImage]}>
            <Text style={styles.placeholderIcon}>
              {item.category === 'Technology' ? '💻' :
               item.category === 'Design' ? '🎨' :
               item.category === 'Business' ? '💼' :
               item.category === 'Art' ? '🖼️' :
               item.category === 'Language' ? '🗣️' :
               item.category === 'Science' ? '🔬' :
               item.category === 'Music' ? '🎵' :
               item.category === 'Fitness' ? '💪' :
               item.category === 'Cooking' ? '👨‍🍳' :
               item.category === 'Photography' ? '📸' :
               item.category === 'Writing' ? '✍️' : '📚'}
            </Text>
          </View>
        )}
        
        <View style={styles.skillInfo}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillName} numberOfLines={2}>
              {item.name}
            </Text>
            
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty_level) }]}>
              <Text style={styles.difficultyText}>
                {getDifficultyIcon(item.difficulty_level)} {item.difficulty_level}
              </Text>
            </View>
          </View>
          
          <Text style={styles.skillCategory}>{item.category}</Text>
          
          {item.description && (
            <Text style={styles.skillDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          
          <View style={styles.skillStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statText}>{stats.content_count}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👨‍🏫</Text>
              <Text style={styles.statText}>{stats.instructor_count}</Text>
            </View>
            
            {stats.avg_rating > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statText}>{stats.avg_rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <ThemedText type="title" style={styles.headerTitle}>
            Skills
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Discover skills to master and grow your expertise
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search skills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterTab,
                  selectedCategory === category && styles.filterTabActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedCategory === category && styles.filterTabTextActive
                ]}>
                  {category === 'all' ? 'All' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Difficulty</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterTab,
                  selectedDifficulty === level && styles.filterTabActive
                ]}
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedDifficulty === level && styles.filterTabTextActive
                ]}>
                  {level === 'all' ? 'All Levels' : `${getDifficultyIcon(level)} ${level}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Skills Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading skills...</Text>
          </View>
        ) : skills.length > 0 ? (
          <FlatList
            data={skills}
            renderItem={renderSkillCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.skillsContainer}
            columnWrapperStyle={styles.skillsRow}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateText}>No skills found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filterTabs: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterTabTextActive: {
    color: '#fff',
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
  skillsContainer: {
    paddingHorizontal: 20,
  },
  skillsRow: {
    justifyContent: 'space-between',
  },
  skillCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillImage: {
    width: '100%',
    height: 120,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  skillInfo: {
    padding: 12,
  },
  skillHeader: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  skillCategory: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  skillDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  skillStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  statText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SkillsScreen;
