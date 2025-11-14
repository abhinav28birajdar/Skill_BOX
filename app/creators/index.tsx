import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
const CARD_WIDTH = width - 40;

interface Creator {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  user_type: string;
  created_at: string;
  total_followers?: number;
  total_content?: number;
  average_rating?: number;
  specializations?: string[];
}

interface CreatorStats {
  follower_count: number;
  content_count: number;
  avg_rating: number;
  total_views: number;
}

const specializations = [
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

export default function CreatorsScreen() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [creatorStats, setCreatorStats] = useState<{ [key: string]: CreatorStats }>({});
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCreators();
    if (user) {
      loadFollowedCreators();
    }
  }, [selectedSpecialization, searchQuery, user]);

  const loadCreators = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('users')
        .select('*')
        .eq('user_type', 'creator')
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`full_name.ilike.%${searchQuery.trim()}%,username.ilike.%${searchQuery.trim()}%,bio.ilike.%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading creators:', error);
      } else {
        let filteredData = data || [];
        
        // Filter by specialization if not 'all'
        if (selectedSpecialization !== 'all') {
          // This would require a proper specializations system in the database
          // For now, we'll filter based on content they've created
          const { data: contentData } = await supabase
            .from('learning_content')
            .select(`
              creator_id,
              skills!inner(category)
            `)
            .eq('status', 'published');
          
          const creatorsWithSpecialization = new Set(
            contentData
              ?.filter(item => (item.skills as any)?.category === selectedSpecialization)
              .map(item => item.creator_id) || []
          );
          
          filteredData = filteredData.filter(creator => 
            creatorsWithSpecialization.has(creator.id)
          );
        }
        
        setCreators(filteredData);
        await loadCreatorStats(filteredData);
      }
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCreatorStats = async (creatorsData: Creator[]) => {
    try {
      const stats: { [key: string]: CreatorStats } = {};
      
      for (const creator of creatorsData) {
        // Get content count and average rating
        const { data: contentData } = await supabase
          .from('learning_content')
          .select('average_rating, total_views')
          .eq('creator_id', creator.id)
          .eq('status', 'published');

        const contentCount = contentData?.length || 0;
        const avgRating = contentData && contentData.length > 0
          ? contentData.reduce((sum, item) => sum + (item.average_rating || 0), 0) / contentData.length
          : 0;
        const totalViews = contentData?.reduce((sum, item) => sum + (item.total_views || 0), 0) || 0;

        // Get follower count (this would require a followers table)
        // For now, we'll use a placeholder
        const followerCount = Math.floor(Math.random() * 1000) + 50; // Placeholder

        stats[creator.id] = {
          follower_count: followerCount,
          content_count: contentCount,
          avg_rating: avgRating,
          total_views: totalViews
        };
      }
      
      setCreatorStats(stats);
    } catch (error) {
      console.error('Error loading creator stats:', error);
    }
  };

  const loadFollowedCreators = async () => {
    if (!user) return;
    
    try {
      // This would require a follows table in the database
      // For now, we'll use local storage or a placeholder
      const followed = new Set<string>();
      setFollowedCreators(followed);
    } catch (error) {
      console.error('Error loading followed creators:', error);
    }
  };

  const handleFollowCreator = async (creatorId: string) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to follow creators', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/signin') }
      ]);
      return;
    }

    try {
      const isFollowing = followedCreators.has(creatorId);
      
      if (isFollowing) {
        // Unfollow logic would go here
        const newFollowed = new Set(followedCreators);
        newFollowed.delete(creatorId);
        setFollowedCreators(newFollowed);
        Alert.alert('Unfollowed', 'You are no longer following this creator');
      } else {
        // Follow logic would go here
        const newFollowed = new Set(followedCreators);
        newFollowed.add(creatorId);
        setFollowedCreators(newFollowed);
        Alert.alert('Following', 'You are now following this creator');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const handleCreatorPress = (creator: Creator) => {
    const stats = creatorStats[creator.id] || { follower_count: 0, content_count: 0, avg_rating: 0, total_views: 0 };
    Alert.alert(
      creator.full_name || creator.username || 'Creator',
      `${creator.bio || 'Professional instructor and content creator'}\n\n` +
      `📚 ${stats.content_count} courses\n` +
      `👥 ${stats.follower_count} followers\n` +
      `⭐ ${stats.avg_rating.toFixed(1)} rating\n` +
      `👁️ ${stats.total_views} views`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Follow', onPress: () => handleFollowCreator(creator.id) }
      ]
    );
  };

  const renderCreatorCard = ({ item }: { item: Creator }) => {
    const stats = creatorStats[item.id] || { follower_count: 0, content_count: 0, avg_rating: 0, total_views: 0 };
    const isFollowing = followedCreators.has(item.id);
    
    return (
      <TouchableOpacity
        style={styles.creatorCard}
        onPress={() => handleCreatorPress(item)}
      >
        <View style={styles.creatorHeader}>
          {item.profile_image_url ? (
            <Image source={{ uri: item.profile_image_url }} style={styles.creatorAvatar} />
          ) : (
            <View style={[styles.creatorAvatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarText}>
                {(item.full_name || item.username || 'C').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName} numberOfLines={1}>
              {item.full_name || item.username}
            </Text>
            
            {item.username && item.full_name && (
              <Text style={styles.creatorUsername}>@{item.username}</Text>
            )}
            
            <View style={styles.creatorBadge}>
              <Text style={styles.badgeText}>✨ Creator</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followButtonActive]}
            onPress={() => handleFollowCreator(item.id)}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
              {isFollowing ? '✓ Following' : '+ Follow'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {item.bio && (
          <Text style={styles.creatorBio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
        
        <View style={styles.creatorStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.content_count}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.follower_count}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.avg_rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating ⭐</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total_views}</Text>
            <Text style={styles.statLabel}>Views</Text>
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
            Creators
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Connect with expert instructors and content creators
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search creators..."
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

        {/* Specialization Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Specialization</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {specializations.map((spec) => (
              <TouchableOpacity
                key={spec}
                style={[
                  styles.filterTab,
                  selectedSpecialization === spec && styles.filterTabActive
                ]}
                onPress={() => setSelectedSpecialization(spec)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedSpecialization === spec && styles.filterTabTextActive
                ]}>
                  {spec === 'all' ? 'All' : spec}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Creators List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading creators...</Text>
          </View>
        ) : creators.length > 0 ? (
          <FlatList
            data={creators}
            renderItem={renderCreatorCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.creatorsContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👨‍🏫</Text>
            <Text style={styles.emptyStateText}>No creators found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery.trim() || selectedSpecialization !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No creators available at the moment'}
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
  creatorsContainer: {
    paddingHorizontal: 20,
  },
  creatorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  creatorUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creatorBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  followButtonActive: {
    backgroundColor: '#007AFF',
  },
  followButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  followButtonTextActive: {
    color: '#fff',
  },
  creatorBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  creatorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
