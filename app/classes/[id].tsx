import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ClassDetail {
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
    bio: string | null;
  };
  skill: {
    name: string;
    description: string | null;
  };
}

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadClassDetail();
    }
  }, [id]);

  const loadClassDetail = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          users:teacher_id(username, full_name, profile_image_url, bio),
          skills:skill_id(name, description)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading class detail:', error);
        Alert.alert('Error', 'Failed to load class details');
      } else {
        setClassDetail(data);
      }
    } catch (error) {
      console.error('Error loading class detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to book a class', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/signin') }
      ]);
      return;
    }
    
    if (!classDetail) return;
    
    Alert.alert(
      'Book Class',
      `Would you like to book "${classDetail.title}" for $${classDetail.base_price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => processBooking() }
      ]
    );
  };

  const processBooking = async () => {
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

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading class details...</Text>
        </View>
      </ThemedView>
    );
  }

  if (!classDetail) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Class not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

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
        </View>

        {/* Class Hero Section */}
        <View style={styles.heroSection}>
          {classDetail.class_thumbnail_url ? (
            <Image source={{ uri: classDetail.class_thumbnail_url }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.placeholderHero]}>
              <Text style={styles.placeholderText}>{getClassTypeIcon(classDetail.class_type)}</Text>
            </View>
          )}
          
          <View style={styles.heroOverlay}>
            <View style={styles.classTypeBadge}>
              <Text style={styles.classTypeText}>{getClassTypeLabel(classDetail.class_type)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Class Info */}
          <View style={styles.classInfo}>
            <Text style={styles.skillName}>{classDetail.skill?.name}</Text>
            <ThemedText type="title" style={styles.title}>
              {classDetail.title}
            </ThemedText>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statText}>{classDetail.duration_minutes} min</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🌐</Text>
                <Text style={styles.statText}>{classDetail.language_of_instruction}</Text>
              </View>
              
              {classDetail.class_type === 'group' && (
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>👥</Text>
                  <Text style={styles.statText}>
                    {classDetail.currently_enrolled}/{classDetail.max_students || '∞'}
                  </Text>
                </View>
              )}
              
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statText}>
                  {classDetail.average_rating?.toFixed(1) || 'New'}
                </Text>
              </View>
            </View>
          </View>

          {/* Instructor Section */}
          <View style={styles.instructorSection}>
            <Text style={styles.sectionTitle}>Instructor</Text>
            <View style={styles.instructorCard}>
              {classDetail.teacher?.profile_image_url ? (
                <Image source={{ uri: classDetail.teacher.profile_image_url }} style={styles.instructorAvatar} />
              ) : (
                <View style={[styles.instructorAvatar, styles.placeholderAvatar]}>
                  <Text style={styles.avatarText}>
                    {(classDetail.teacher?.full_name || classDetail.teacher?.username || 'T').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>
                  {classDetail.teacher?.full_name || classDetail.teacher?.username}
                </Text>
                {classDetail.teacher?.bio && (
                  <Text style={styles.instructorBio} numberOfLines={2}>
                    {classDetail.teacher.bio}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Class</Text>
            <Text style={styles.description}>
              {classDetail.description}
            </Text>
          </View>

          {/* What You'll Learn */}
          <View style={styles.skillSection}>
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
            <Text style={styles.skillDescription}>
              {classDetail.skill?.description || `Master the fundamentals of ${classDetail.skill?.name} through hands-on practice and expert guidance.`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceSection}>
          <Text style={styles.price}>
            ${classDetail.base_price.toFixed(2)}
            {classDetail.class_type === 'one_on_one' && <Text style={styles.priceLabel}> /session</Text>}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookClass}
        >
          <Text style={styles.bookButtonText}>Book This Class</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  heroSection: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: 250,
  },
  placeholderHero: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  classTypeBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  classTypeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  classInfo: {
    marginBottom: 24,
  },
  skillName: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  instructorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  instructorAvatar: {
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
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructorBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  skillSection: {
    marginBottom: 24,
  },
  skillDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSection: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});
