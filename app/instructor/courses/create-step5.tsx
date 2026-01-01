/**
 * Course Creation Wizard - Step 5: Publish
 * Features: Final publish confirmation and success
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCourseStep5Screen() {
  const router = useRouter();
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 2000);
  };

  if (published) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.successContainer}>
          <Animated.View entering={FadeIn.delay(200)} style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.successIconGradient}>
                <Ionicons name="checkmark" size={64} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.successTitle}>Course Published!</Text>
            <Text style={styles.successSubtitle}>
              Your course has been submitted for review. We'll notify you once it's approved and live.
            </Text>

            <View style={styles.successStats}>
              <View style={styles.successStat}>
                <Ionicons name="time-outline" size={24} color="#6366F1" />
                <Text style={styles.successStatLabel}>Review Time</Text>
                <Text style={styles.successStatValue}>2-3 days</Text>
              </View>
              <View style={styles.successStat}>
                <Ionicons name="people-outline" size={24} color="#10B981" />
                <Text style={styles.successStatLabel}>Potential Reach</Text>
                <Text style={styles.successStatValue}>45K+ students</Text>
              </View>
            </View>

            <View style={styles.successActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/instructor/dashboard')}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/instructor/courses/create')}
              >
                <Text style={styles.secondaryButtonText}>Create Another Course</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
        </View>
        <Text style={styles.progressTitle}>Step 5 of 5: Publish Course</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.readyCard}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.readyGradient}>
            <Ionicons name="rocket" size={64} color="#fff" />
            <Text style={styles.readyTitle}>Ready to Launch!</Text>
            <Text style={styles.readySubtitle}>
              Your course is ready to be published. Once published, students can discover and enroll.
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>What Happens Next?</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Quality Review</Text>
                <Text style={styles.stepDescription}>
                  Our team reviews your course for quality standards
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Course Goes Live</Text>
                <Text style={styles.stepDescription}>
                  Approved courses are published within 2-3 business days
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Start Earning</Text>
                <Text style={styles.stepDescription}>
                  Students can enroll and you start earning revenue
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.termsCard}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <View style={styles.termsInfo}>
            <Text style={styles.termsTitle}>Terms & Guidelines</Text>
            <Text style={styles.termsText}>
              By publishing, you agree to our instructor terms and content guidelines.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveDraftButton}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          disabled={publishing}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.publishGradient}
          >
            {publishing ? (
              <Text style={styles.publishText}>Publishing...</Text>
            ) : (
              <>
                <Ionicons name="rocket" size={20} color="#fff" />
                <Text style={styles.publishText}>Publish Course</Text>
              </>
            )}
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
  readyCard: { margin: 20, borderRadius: 20, overflow: 'hidden' },
  readyGradient: { padding: 40, alignItems: 'center' },
  readyTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 16, marginBottom: 12 },
  readySubtitle: { fontSize: 15, color: '#E0E7FF', textAlign: 'center', lineHeight: 22 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  stepsList: { gap: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 16 },
  stepNumber: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  stepDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  termsCard: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 20, padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#D1FAE5', gap: 12 },
  termsInfo: { flex: 1 },
  termsTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  termsText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  saveDraftButton: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12 },
  saveDraftText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  publishButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  publishGradient: { flexDirection: 'row', paddingVertical: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  publishText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  successContent: { alignItems: 'center', maxWidth: 400 },
  successIconContainer: { marginBottom: 24 },
  successIconGradient: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 12, textAlign: 'center' },
  successSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  successStats: { flexDirection: 'row', gap: 16, marginBottom: 32, width: '100%' },
  successStat: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  successStatLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginTop: 12, marginBottom: 4, textAlign: 'center' },
  successStatValue: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  successActions: { width: '100%', gap: 12 },
  primaryButton: { borderRadius: 12, overflow: 'hidden' },
  primaryGradient: { paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryButton: { paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  secondaryButtonText: { fontSize: 16, fontWeight: '700', color: '#6366F1' },
});
