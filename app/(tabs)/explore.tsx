
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { LearningContent, Skill, User } from '@/types/database';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'skills' | 'creators' | 'content'>('all');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [creators, setCreators] = useState<User[]>([]);
  const [content, setContent] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchData(searchQuery);
    } else {
      loadData();
    }
  }, [searchQuery, selectedFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (selectedFilter === 'all' || selectedFilter === 'skills') {
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (skillsData) setSkills(skillsData);
      }

      if (selectedFilter === 'all' || selectedFilter === 'creators') {
        const { data: creatorsData } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'creator')
          .eq('creator_status', 'approved')
          .order('full_name');
        
        if (creatorsData) setCreators(creatorsData);
      }

      if (selectedFilter === 'all' || selectedFilter === 'content') {
        const { data: contentData } = await supabase
          .from('learning_content')
          .select(`
            *,
            skills(name),
            users(username, full_name)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (contentData) setContent(contentData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchData = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      
      if (selectedFilter === 'all' || selectedFilter === 'skills') {
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_active', true);
        
        if (skillsData) setSkills(skillsData);
      }

      if (selectedFilter === 'all' || selectedFilter === 'creators') {
        const { data: creatorsData } = await supabase
          .from('users')
          .select('*')
          .or(`username.ilike.%${query}%,full_name.ilike.%${query}%,bio.ilike.%${query}%`)
          .eq('role', 'creator')
          .eq('creator_status', 'approved');
        
        if (creatorsData) setCreators(creatorsData);
      }

      if (selectedFilter === 'all' || selectedFilter === 'content') {
        const { data: contentData } = await supabase
          .from('learning_content')
          .select(`
            *,
            skills(name),
            users(username, full_name)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('status', 'approved')
          .limit(20);
        
        if (contentData) setContent(contentData);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkillItem = ({ item }: { item: Skill }) => (
    <TouchableOpacity
      style={styles.skillItem}
      onPress={() => Alert.alert('Skill Details', `View details for: ${item.name}`)}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.skillImage} />
      ) : (
        <View style={[styles.skillImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.skillDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCreatorItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.creatorItem}
      onPress={() => Alert.alert('Creator Profile', `View profile for: ${item.full_name || item.username}`)}
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
      <View style={styles.creatorInfo}>
        <Text style={styles.creatorName}>{item.full_name || item.username}</Text>
        {item.bio && (
          <Text style={styles.creatorBio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }: { item: LearningContent }) => (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={() => Alert.alert('Content Details', `View content: ${item.title}`)}
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

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'skills', label: 'Skills' },
    { key: 'creators', label: 'Creators' },
    { key: 'content', label: 'Content' },
  ] as const;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Explore
        </ThemedText>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills, creators, content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterButtons.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {(selectedFilter === 'all' || selectedFilter === 'skills') && skills.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Skills
            </ThemedText>
            <FlatList
              data={skills}
              renderItem={renderSkillItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {(selectedFilter === 'all' || selectedFilter === 'creators') && creators.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Creators
            </ThemedText>
            <FlatList
              data={creators}
              renderItem={renderCreatorItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {(selectedFilter === 'all' || selectedFilter === 'content') && content.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Content
            </ThemedText>
            <FlatList
              data={content}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {!loading && searchQuery && skills.length === 0 && creators.length === 0 && content.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No results found for "{searchQuery}"
            </ThemedText>
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
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    padding: 16,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
  },
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creatorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  creatorBio: {
    fontSize: 14,
    color: '#666',
  },
  contentItem: {
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
