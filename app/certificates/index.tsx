/**
 * Certificates Page
 * Features: Earned certificates, download, share
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CERTIFICATES = [
  {
    id: 1,
    courseName: 'React Native Masterclass',
    instructor: 'John Smith',
    completedDate: 'December 10, 2024',
    certificateNumber: 'RN-2024-001234',
    verified: true,
    thumbnail: 'https://picsum.photos/seed/cert1/600/400',
  },
  {
    id: 2,
    courseName: 'Advanced TypeScript',
    instructor: 'Sarah Chen',
    completedDate: 'November 25, 2024',
    certificateNumber: 'TS-2024-005678',
    verified: true,
    thumbnail: 'https://picsum.photos/seed/cert2/600/400',
  },
  {
    id: 3,
    courseName: 'UI/UX Design Fundamentals',
    instructor: 'Emma Wilson',
    completedDate: 'October 15, 2024',
    certificateNumber: 'UX-2024-009012',
    verified: true,
    thumbnail: 'https://picsum.photos/seed/cert3/600/400',
  },
];

export default function CertificatesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Certificates</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{CERTIFICATES.length}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{CERTIFICATES.filter(c => c.verified).length}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
        </View>

        {/* Certificates List */}
        <View style={styles.certificatesList}>
          {CERTIFICATES.map((cert, index) => (
            <Animated.View key={cert.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity style={styles.certificateCard}>
                <Image source={{ uri: cert.thumbnail }} style={styles.certificateThumbnail} />
                
                {cert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}

                <View style={styles.certificateContent}>
                  <Text style={styles.courseName}>{cert.courseName}</Text>
                  <Text style={styles.instructor}>by {cert.instructor}</Text>
                  <View style={styles.certificateDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{cert.completedDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{cert.certificateNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="download-outline" size={18} color="#6366F1" />
                      <Text style={styles.actionText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share-social-outline" size={18} color="#6366F1" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="eye-outline" size={18} color="#6366F1" />
                      <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366F1" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Share Your Success</Text>
            <Text style={styles.infoText}>
              Add your certificates to LinkedIn or share them on social media to showcase your achievements.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  certificatesList: { paddingHorizontal: 20, gap: 16 },
  certificateCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  certificateThumbnail: { width: '100%', height: 160 },
  verifiedBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8 },
  verifiedText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  certificateContent: { padding: 16 },
  courseName: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  instructor: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  certificateDetails: { gap: 6, marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, backgroundColor: '#EEF2FF', borderRadius: 8 },
  actionText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', margin: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16, gap: 12 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#4338CA', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#4338CA', lineHeight: 20 },
  bottomSpacing: { height: 40 },
});
