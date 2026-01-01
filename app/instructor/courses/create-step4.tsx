/**
 * Course Creation Wizard - Step 4: Preview
 * Features: Review course before publishing
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCourseStep4Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Course</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
        </View>
        <Text style={styles.progressTitle}>Step 4 of 5: Preview Course</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Card */}
        <View style={styles.previewCard}>
          <Image
            source={{ uri: 'https://picsum.photos/400/225?random=10' }}
            style={styles.thumbnail}
          />
          <View style={styles.cardContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Development</Text>
            </View>
            <Text style={styles.courseTitle}>React Native Masterclass</Text>
            <Text style={styles.courseDescription}>
              Master React Native by building real-world mobile applications from scratch.
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>12 hours</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="play-circle-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>30 lessons</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="bar-chart-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>Intermediate</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>$49.99</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>New Course</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publishing Checklist</Text>
          
          <View style={styles.checklistCard}>
            <View style={styles.checklistItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistTitle}>Course Information</Text>
                <Text style={styles.checklistSubtitle}>Title, description, and category set</Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistTitle}>Curriculum</Text>
                <Text style={styles.checklistSubtitle}>3 sections with 30 lessons</Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistTitle}>Pricing</Text>
                <Text style={styles.checklistSubtitle}>$49.99 one-time payment</Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="alert-circle" size={24} color="#F59E0B" />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistTitle}>Course Thumbnail</Text>
                <Text style={styles.checklistSubtitle}>Recommended: 1280x720px</Text>
              </View>
            </View>

            <View style={styles.checklistItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="alert-circle" size={24} color="#F59E0B" />
              </View>
              <View style={styles.checklistInfo}>
                <Text style={styles.checklistTitle}>Promotional Video</Text>
                <Text style={styles.checklistSubtitle}>Optional but recommended</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#6366F1" />
          <Text style={styles.infoText}>
            Your course will be reviewed by our team within 2-3 business days before going live.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveDraftButton}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/instructor/courses/create-step5')}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue to Publish</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  progressContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  progressSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  step: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#10B981' },
  stepActive: { backgroundColor: '#6366F1' },
  stepNumber: { fontSize: 14, fontWeight: '800', color: '#6B7280' },
  progressLine: { width: 32, height: 2, backgroundColor: '#10B981' },
  progressLineInactive: { backgroundColor: '#E5E7EB' },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  content: { flex: 1 },
  previewCard: { margin: 20, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  thumbnail: { width: '100%', height: 200 },
  cardContent: { padding: 16 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EEF2FF', borderRadius: 20, marginBottom: 12 },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },
  courseTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  courseDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 24, fontWeight: '800', color: '#6366F1' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  checklistCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 16 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkIcon: { width: 40, height: 40 },
  checklistInfo: { flex: 1 },
  checklistTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  checklistSubtitle: { fontSize: 13, color: '#6B7280' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 12, gap: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 20 },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  saveDraftButton: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12 },
  saveDraftText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  continueButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  continueGradient: { flexDirection: 'row', paddingVertical: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  continueText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
