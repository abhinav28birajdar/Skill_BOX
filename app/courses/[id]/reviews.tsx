/**
 * Course Reviews Page
 * Features: Write reviews, view all reviews, ratings breakdown
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const REVIEWS = [
  {
    id: 1,
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    date: '2 days ago',
    review: 'Excellent course! The instructor explains everything clearly and the projects are very practical. Highly recommend!',
    helpful: 24,
  },
  {
    id: 2,
    author: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4,
    date: '1 week ago',
    review: 'Great content overall. Some sections could be more detailed, but the hands-on approach is really effective.',
    helpful: 15,
  },
  {
    id: 3,
    author: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    date: '2 weeks ago',
    review: 'Best investment I made this year! Learned so much and already applied it to my projects.',
    helpful: 32,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 1234, percentage: 72 },
  { stars: 4, count: 345, percentage: 20 },
  { stars: 3, count: 89, percentage: 5 },
  { stars: 2, count: 34, percentage: 2 },
  { stars: 1, count: 12, percentage: 1 },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const totalReviews = RATING_BREAKDOWN.reduce((sum, r) => sum + r.count, 0);
  const averageRating = 4.8;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Rating */}
        <View style={styles.overallCard}>
          <View style={styles.overallLeft}>
            <Text style={styles.overallRating}>{averageRating}</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(averageRating) ? 'star' : 'star-outline'}
                  size={16}
                  color="#F59E0B"
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews.toLocaleString()} reviews</Text>
          </View>

          <View style={styles.overallRight}>
            {RATING_BREAKDOWN.map((item) => (
              <View key={item.stars} style={styles.ratingRow}>
                <View style={styles.starsLabel}>
                  {[...Array(item.stars)].map((_, i) => (
                    <Ionicons key={i} name="star" size={10} color="#F59E0B" />
                  ))}
                </View>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBar, { width: `${item.percentage}%` }]} />
                </View>
                <Text style={styles.ratingCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Write Review */}
        <View style={styles.writeReviewCard}>
          <Text style={styles.writeReviewTitle}>Write a Review</Text>
          
          <View style={styles.ratingSelector}>
            <Text style={styles.ratingLabel}>Your Rating</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                  <Ionicons
                    name={star <= userRating ? 'star' : 'star-outline'}
                    size={32}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this course..."
            placeholderTextColor="#9CA3AF"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitButton}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Submit Review</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Reviews</Text>
          <View style={styles.reviewsList}>
            {REVIEWS.map((review, index) => (
              <Animated.View key={review.id} entering={FadeInDown.delay(index * 100)} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewHeaderInfo}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? 'star' : 'star-outline'}
                          size={14}
                          color="#F59E0B"
                        />
                      ))}
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.review}</Text>
                <View style={styles.reviewFooter}>
                  <TouchableOpacity style={styles.helpfulButton}>
                    <Ionicons name="thumbs-up-outline" size={16} color="#6B7280" />
                    <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="flag-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

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
  overallCard: { flexDirection: 'row', margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, gap: 24 },
  overallLeft: { alignItems: 'center' },
  overallRating: { fontSize: 48, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  stars: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  totalReviews: { fontSize: 13, color: '#6B7280' },
  overallRight: { flex: 1, gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  starsLabel: { flexDirection: 'row', width: 50 },
  ratingBarContainer: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  ratingBar: { height: '100%', backgroundColor: '#F59E0B' },
  ratingCount: { fontSize: 12, fontWeight: '600', color: '#6B7280', width: 35, textAlign: 'right' },
  writeReviewCard: { marginHorizontal: 20, marginBottom: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  writeReviewTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  ratingSelector: { marginBottom: 16 },
  ratingLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  ratingStars: { flexDirection: 'row', gap: 8 },
  reviewInput: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 15, color: '#1F2937', textAlignVertical: 'top', marginBottom: 16, minHeight: 100 },
  submitButton: { borderRadius: 12, overflow: 'hidden' },
  submitGradient: { paddingVertical: 14, alignItems: 'center' },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  reviewsList: { gap: 16 },
  reviewCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22 },
  reviewHeaderInfo: { flex: 1 },
  reviewAuthor: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  reviewStars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  reviewDate: { fontSize: 12, color: '#9CA3AF', marginLeft: 8 },
  reviewText: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 12 },
  reviewFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  helpfulButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpfulText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
