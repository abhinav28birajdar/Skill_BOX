import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext.enhanced';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  duration: number | null;
  order_index: number;
  is_published: boolean;
  course?: {
    title: string;
    creator_id: string;
  };
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          course:courses(title, creator_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setLesson(data);
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    if (!user || !lesson) return;

    try {
      // Here we would typically update progress tracking
      Alert.alert('Great!', 'Lesson marked as complete');
      setProgress(100);
    } catch (error) {
      console.error('Error marking complete:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loading} />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText>Lesson not found</ThemedText>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>
              {lesson.course?.title || 'Course'}
            </Text>
          </View>

          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          {lesson.duration && (
            <View style={styles.durationInfo}>
              <Text style={styles.durationText}>
                Duration: {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} min
              </Text>
            </View>
          )}

          {lesson.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>{lesson.description}</Text>
            </View>
          )}

          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>
                📹 Video Content
              </Text>
              <Text style={styles.videoSubtext}>
                Video player would be integrated here
              </Text>
            </View>
          </View>

          <View style={styles.lessonContent}>
            <Text style={styles.sectionTitle}>Lesson Notes</Text>
            <Text style={styles.lessonText}>
              This is where the lesson content would be displayed. In a full implementation, 
              this could include rich text, images, code snippets, and interactive elements.
            </Text>
          </View>
        </ThemedView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={markAsComplete}
          disabled={progress === 100}
        >
          <Text style={styles.completeButtonText}>
            {progress === 100 ? 'Completed ✓' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  courseInfo: {
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  durationInfo: {
    marginBottom: 20,
  },
  durationText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  videoContainer: {
    marginBottom: 24,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  videoPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lessonContent: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lessonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
