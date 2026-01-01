/**
 * Wishlist/Saved Courses
 * Features: Save courses for later, quick enrollment
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const WISHLIST_COURSES = [
  {
    id: 1,
    title: 'Advanced JavaScript Patterns',
    instructor: 'John Smith',
    price: 49.99,
    originalPrice: 99.99,
    rating: 4.8,
    students: 12345,
    thumbnail: 'https://picsum.photos/seed/wish1/400/200',
    discount: 50,
  },
  {
    id: 2,
    title: 'Python for Data Science',
    instructor: 'Sarah Chen',
    price: 39.99,
    originalPrice: 79.99,
    rating: 4.9,
    students: 8976,
    thumbnail: 'https://picsum.photos/seed/wish2/400/200',
    discount: 50,
  },
  {
    id: 3,
    title: 'Mobile App Design Masterclass',
    instructor: 'Emma Wilson',
    price: 59.99,
    originalPrice: 119.99,
    rating: 4.7,
    students: 6543,
    thumbnail: 'https://picsum.photos/seed/wish3/400/200',
    discount: 50,
  },
];

export default function WishlistScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wishlist Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{WISHLIST_COURSES.length}</Text>
            <Text style={styles.statLabel}>Saved Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ${WISHLIST_COURSES.reduce((sum, c) => sum + c.price, 0).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>50%</Text>
            <Text style={styles.statLabel}>Avg Savings</Text>
          </View>
        </View>

        {/* Courses List */}
        <View style={styles.coursesList}>
          {WISHLIST_COURSES.map((course, index) => (
            <Animated.View key={course.id} entering={FadeInDown.delay(index * 100)}>
              <View style={styles.courseCard}>
                <TouchableOpacity style={styles.courseContent}>
                  <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
                  
                  {course.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{course.discount}% OFF</Text>
                    </View>
                  )}

                  <TouchableOpacity style={styles.removeButton}>
                    <Ionicons name="heart" size={20} color="#EF4444" />
                  </TouchableOpacity>

                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={styles.instructor}>{course.instructor}</Text>
                    
                    <View style={styles.metaRow}>
                      <View style={styles.rating}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>{course.rating}</Text>
                      </View>
                      <Text style={styles.students}>
                        {course.students.toLocaleString()} students
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>${course.price}</Text>
                        <Text style={styles.originalPrice}>${course.originalPrice}</Text>
                      </View>
                      <TouchableOpacity style={styles.enrollButton}>
                        <LinearGradient
                          colors={['#6366F1', '#8B5CF6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.enrollGradient}
                        >
                          <Text style={styles.enrollText}>Enroll</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Empty State (if needed) */}
        {WISHLIST_COURSES.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptyText}>
              Save courses you're interested in to access them later
            </Text>
            <TouchableOpacity style={styles.browseButton}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.browseGradient}
              >
                <Text style={styles.browseText}>Browse Courses</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  content: { flex: 1 },
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  coursesList: { paddingHorizontal: 20, gap: 16 },
  courseCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  courseContent: { position: 'relative' },
  thumbnail: { width: '100%', height: 160 },
  discountBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#EF4444', borderRadius: 8 },
  discountText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  removeButton: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  courseInfo: { padding: 16 },
  courseTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  instructor: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  students: { fontSize: 12, color: '#6B7280' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  originalPrice: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through' },
  enrollButton: { borderRadius: 8, overflow: 'hidden' },
  enrollGradient: { paddingHorizontal: 20, paddingVertical: 10 },
  enrollText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  browseButton: { borderRadius: 12, overflow: 'hidden' },
  browseGradient: { paddingHorizontal: 32, paddingVertical: 14 },
  browseText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
