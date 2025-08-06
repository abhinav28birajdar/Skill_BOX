import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext.enhanced';
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
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface Course {
  id: string;
  title: string;
  description: string;
  course_thumbnail_url: string | null;
  price: number;
  skill_id: string;
  sub_skill_id: string | null;
  language_taught: string;
  status: string;
  average_rating: number;
  total_students_enrolled: number;
  teacher: {
    username: string | null;
    full_name: string | null;
    profile_image_url: string | null;
  };
  skill: {
    name: string;
  };
}

export default function CoursesScreen() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    loadCourses();
  }, [selectedFilter]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('courses')
        .select(`
          *,
          users:teacher_id(username, full_name, profile_image_url),
          skills:skill_id(name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (selectedFilter === 'free') {
        query = query.eq('price', 0);
      } else if (selectedFilter === 'paid') {
        query = query.gt('price', 0);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading courses:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course: Course) => {
    router.push(`/courses/${course.id}`);
  };

  const renderCourseCard = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      {item.course_thumbnail_url ? (
        <Image source={{ uri: item.course_thumbnail_url }} style={styles.courseThumbnail} />
      ) : (
        <View style={[styles.courseThumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderText}>📚</Text>
        </View>
      )}
      
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
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
        
        <View style={styles.courseStats}>
          <Text style={styles.rating}>⭐ {item.average_rating?.toFixed(1) || 'New'}</Text>
          <Text style={styles.students}>{item.total_students_enrolled || 0} students</Text>
        </View>
        
        <Text style={styles.price}>
          {item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}
        </Text>
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
            Courses
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Discover structured learning paths created by expert instructors
          </ThemedText>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {(['all', 'free', 'paid'] as const).map((filter) => (
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
                  {filter === 'all' ? 'All Courses' : filter === 'free' ? 'Free' : 'Premium'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Courses Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading courses...</Text>
          </View>
        ) : courses.length > 0 ? (
          <View style={styles.coursesContainer}>
            <FlatList
              data={courses}
              renderItem={renderCourseCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.coursesGrid}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateText}>No courses found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedFilter === 'free' 
                ? 'No free courses available at the moment'
                : selectedFilter === 'paid'
                ? 'No premium courses available at the moment'
                : 'No courses available at the moment'}
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
  coursesContainer: {
    paddingHorizontal: 10,
  },
  coursesGrid: {
    paddingBottom: 20,
  },
  courseCard: {
    width: CARD_WIDTH,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseThumbnail: {
    width: '100%',
    height: 120,
  },
  placeholderThumbnail: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
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
    marginBottom: 8,
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
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  students: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
