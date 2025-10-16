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
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface LiveClass {
  id: string;
  title: string;
  description: string;
  class_type: 'one_on_one' | 'group' | 'workshop';
  base_price: number;
  duration_minutes: number;
  language_of_instruction: string;
  class_thumbnail_url: string | null;
  max_students: number | null;
  currently_enrolled: number;
  average_rating: number;
  status: string;
  teacher: {
    username: string | null;
    full_name: string | null;
    profile_image_url: string | null;
  };
  skill: {
    name: string;
  };
}

export default function LiveClassesScreen() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'one_on_one' | 'group' | 'workshop'>('all');

  useEffect(() => {
    loadLiveClasses();
  }, [selectedFilter]);

  const loadLiveClasses = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('classes')
        .select(`
          *,
          users:teacher_id(username, full_name, profile_image_url),
          skills:skill_id(name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (selectedFilter !== 'all') {
        query = query.eq('class_type', selectedFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading classes:', error);
      } else {
        setClasses(data || []);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassPress = (classItem: LiveClass) => {
    Alert.alert(
      classItem.title,
      classItem.description,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => handleBookClass(classItem) }
      ]
    );
  };

  const handleBookClass = (classItem: LiveClass) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book a class', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/signin') }
      ]);
      return;
    }
    
    Alert.alert(
      'Book Class',
      `Would you like to book "${classItem.title}" for $${classItem.base_price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => processBooking(classItem) }
      ]
    );
  };

  const processBooking = async (classItem: LiveClass) => {
    try {
      // This would integrate with your booking system
      Alert.alert('Booking Confirmed', 'Your class has been booked successfully!');
    } catch (error) {
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const getClassTypeIcon = (type: string) => {
    switch (type) {
      case 'one_on_one':
        return '👨‍🏫';
      case 'group':
        return '👥';
      case 'workshop':
        return '🎯';
      default:
        return '📹';
    }
  };

  const getClassTypeLabel = (type: string) => {
    switch (type) {
      case 'one_on_one':
        return '1-on-1';
      case 'group':
        return 'Group';
      case 'workshop':
        return 'Workshop';
      default:
        return type;
    }
  };

  const renderClassCard = ({ item }: { item: LiveClass }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => handleClassPress(item)}
    >
      <View style={styles.classHeader}>
        {item.class_thumbnail_url ? (
          <Image source={{ uri: item.class_thumbnail_url }} style={styles.classThumbnail} />
        ) : (
          <View style={[styles.classThumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderText}>{getClassTypeIcon(item.class_type)}</Text>
          </View>
        )}
        
        <View style={styles.classInfo}>
          <View style={styles.classTypeBadge}>
            <Text style={styles.classTypeText}>{getClassTypeLabel(item.class_type)}</Text>
          </View>
          
          <Text style={styles.classTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.skillName}>{item.skill?.name}</Text>
          
          <View style={styles.instructorInfo}>
            {item.teacher?.profile_image_url ? (
              <Image source={{ uri: item.teacher.profile_image_url }} style={styles.instructorAvatar} />
            ) : (
              <View style={[styles.instructorAvatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>
                  {(item.teacher?.full_name || item.teacher?.username || 'T').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.instructorName} numberOfLines={1}>
              {item.teacher?.full_name || item.teacher?.username}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.classDetails}>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.classStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statText}>{item.duration_minutes} min</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🌐</Text>
            <Text style={styles.statText}>{item.language_of_instruction}</Text>
          </View>
          
          {item.class_type === 'group' && (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statText}>
                {item.currently_enrolled}/{item.max_students || '∞'}
              </Text>
            </View>
          )}
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statText}>
              {item.average_rating?.toFixed(1) || 'New'}
            </Text>
          </View>
        </View>
        
        <View style={styles.classFooter}>
          <Text style={styles.price}>
            ${item.base_price.toFixed(2)}
            {item.class_type === 'one_on_one' && <Text style={styles.priceLabel}> /session</Text>}
          </Text>
          
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleBookClass(item)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            Live Classes
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Book personalized sessions with expert instructors
          </ThemedText>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {(['all', 'one_on_one', 'group', 'workshop'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.filterTabTextActive
                ]}>
                  {filter === 'all' ? 'All Classes' : getClassTypeLabel(filter)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Classes List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading classes...</Text>
          </View>
        ) : classes.length > 0 ? (
          <FlatList
            data={classes}
            renderItem={renderClassCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.classesContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📹</Text>
            <Text style={styles.emptyStateText}>No live classes found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedFilter === 'all' 
                ? 'No live classes available at the moment'
                : `No ${getClassTypeLabel(selectedFilter).toLowerCase()} classes available`}
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
  filterSection: {
    marginBottom: 20,
  },
  filterTabs: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
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
  classesContainer: {
    paddingHorizontal: 20,
  },
  classCard: {
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
  classHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  classThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderThumbnail: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  classInfo: {
    flex: 1,
  },
  classTypeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  classTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 24,
  },
  skillName: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructorName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  classDetails: {
    padding: 16,
    paddingTop: 0,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  classStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
