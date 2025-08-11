import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CourseWithInstructor {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  course_thumbnail_url: string | null;
  price: number;
  difficulty_level: string;
  total_students_enrolled: number;
  instructor?: {
    id: string;
    full_name: string | null;
    username: string;
    profile_image_url: string | null;
    bio: string | null;
  };
  enrollments?: { count: number }[];
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  duration: number | null;
  order_index: number;
  is_published: boolean;
}

interface Enrollment {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date: string;
  status: string;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<CourseWithInstructor | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    try {
      await Promise.all([
        loadCourse(),
        loadLessons(),
        loadEnrollment()
      ]);
    } catch (error) {
      console.error('Error loading course data:', error);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users!courses_instructor_id_fkey(
          id,
          full_name,
          username,
          profile_image_url,
          bio
        ),
        enrollments(count)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    setCourse(data);
  };

  const loadLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    setLessons(data || []);
  };

  const loadEnrollment = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', id)
      .eq('student_id', user.id)
      .single();

    if (!error && data) {
      setEnrollment(data);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: course.id,
          student_id: user.id,
          enrollment_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;

      Alert.alert('Success', 'Successfully enrolled in course!');
      await loadEnrollment();
    } catch (error) {
      console.error('Error enrolling:', error);
      Alert.alert('Error', 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCourseData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loading} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText>Course not found</ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const isEnrolled = !!enrollment;
  const isOwner = user?.id === course.creator_id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {course.course_thumbnail_url && (
          <Image
            source={{ uri: course.course_thumbnail_url }}
            style={styles.thumbnail}
          />
        )}

        <ThemedView style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>

          <View style={styles.instructorInfo}>
            <View style={styles.instructorDetails}>
              {course.instructor?.profile_image_url ? (
                <Image
                  source={{ uri: course.instructor.profile_image_url }}
                  style={styles.instructorAvatar}
                />
              ) : (
                <View style={[styles.instructorAvatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>
                    {course.instructor?.full_name?.charAt(0) || '?'}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.instructorName}>
                  {course.instructor?.full_name || course.instructor?.username}
                </Text>
                <Text style={styles.instructorTitle}>Instructor</Text>
              </View>
            </View>
          </View>

          <View style={styles.courseMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Students</Text>
              <Text style={styles.metadataValue}>
                {course.enrollments?.[0]?.count || 0}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Level</Text>
              <Text style={styles.metadataValue}>{course.difficulty_level}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Duration</Text>
              <Text style={styles.metadataValue}>
                {lessons.length} lessons
              </Text>
            </View>
          </View>

          {course.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{course.description}</Text>
            </View>
          )}

          {lessons.length > 0 && (
            <View style={styles.lessonsSection}>
              <Text style={styles.sectionTitle}>Lessons</Text>
              {lessons.map((lesson, index) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonItem}
                  onPress={() => {
                    if (isEnrolled || isOwner) {
                      router.push(`/lessons/${lesson.id}`);
                    } else {
                      Alert.alert('Enroll Required', 'Please enroll to access lessons');
                    }
                  }}
                >
                  <View style={styles.lessonNumber}>
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.lessonContent}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    {lesson.duration && (
                      <Text style={styles.lessonDuration}>
                        {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} min
                      </Text>
                    )}
                  </View>
                  <Text style={styles.lessonArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ThemedView>
      </ScrollView>

      {!isOwner && (
        <View style={styles.footer}>
          <View style={styles.priceSection}>
            {course.price && course.price > 0 ? (
              <Text style={styles.price}>${course.price}</Text>
            ) : (
              <Text style={styles.freePrice}>Free</Text>
            )}
          </View>
          
          {isEnrolled ? (
            <TouchableOpacity 
              style={[styles.enrollButton, styles.enrolledButton]}
              onPress={() => router.push(`/lessons/${lessons[0]?.id}`)}
            >
              <Text style={styles.enrolledButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.enrollButton}
              onPress={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.enrollButtonText}>
                  {course.price && course.price > 0 ? 'Purchase Course' : 'Enroll Free'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  thumbnail: {
    width: width,
    height: 250,
  },
  courseInfo: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  instructorInfo: {
    marginBottom: 20,
  },
  instructorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  instructorTitle: {
    fontSize: 14,
    color: '#666',
  },
  courseMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  metadataItem: {
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  lessonsSection: {
    marginBottom: 24,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#666',
  },
  lessonArrow: {
    fontSize: 20,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  priceSection: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  freePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  enrollButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  enrolledButton: {
    backgroundColor: '#4caf50',
  },
  enrollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  enrolledButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
