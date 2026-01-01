/**
 * Downloads/Offline Content
 * Features: Downloaded lessons, manage storage
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const DOWNLOADED_CONTENT = [
  {
    id: 1,
    courseTitle: 'React Native Masterclass',
    lessonTitle: 'Introduction to React Native',
    duration: '45:30',
    size: '245 MB',
    thumbnail: 'https://picsum.photos/seed/down1/400/200',
    downloadDate: '2 days ago',
    progress: 100,
  },
  {
    id: 2,
    courseTitle: 'React Native Masterclass',
    lessonTitle: 'Setting Up Development Environment',
    duration: '32:15',
    size: '180 MB',
    thumbnail: 'https://picsum.photos/seed/down2/400/200',
    downloadDate: '2 days ago',
    progress: 100,
  },
  {
    id: 3,
    courseTitle: 'Advanced TypeScript',
    lessonTitle: 'Generics and Advanced Types',
    duration: '58:42',
    size: '320 MB',
    thumbnail: 'https://picsum.photos/seed/down3/400/200',
    downloadDate: '1 week ago',
    progress: 65,
  },
];

export default function DownloadsScreen() {
  const router = useRouter();
  const totalSize = DOWNLOADED_CONTENT.reduce((sum, item) => {
    if (item.progress === 100) {
      return sum + parseFloat(item.size);
    }
    return sum;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Storage Info */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageIcon}>
              <Ionicons name="phone-portrait-outline" size={28} color="#6366F1" />
            </View>
            <View style={styles.storageInfo}>
              <Text style={styles.storageTitle}>Device Storage</Text>
              <Text style={styles.storageValue}>{totalSize.toFixed(0)} MB used</Text>
            </View>
          </View>
          <View style={styles.storageBar}>
            <View style={[styles.storageProgress, { width: '15%' }]} />
          </View>
          <Text style={styles.storageText}>3.2 GB available of 32 GB</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color="#6366F1" />
            <Text style={styles.actionButtonText}>Download Quality</Text>
            <Text style={styles.actionValue}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="wifi-outline" size={20} color="#6366F1" />
            <Text style={styles.actionButtonText}>Download via WiFi only</Text>
            <View style={styles.toggle}>
              <View style={styles.toggleActive} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Downloads List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Downloaded Content</Text>
            <TouchableOpacity>
              <Text style={styles.deleteAll}>Delete All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.downloadsList}>
            {DOWNLOADED_CONTENT.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                <View style={styles.downloadCard}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.downloadInfo}>
                    <Text style={styles.courseTitle} numberOfLines={1}>{item.courseTitle}</Text>
                    <Text style={styles.lessonTitle} numberOfLines={2}>{item.lessonTitle}</Text>
                    
                    {item.progress === 100 ? (
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={14} color="#6B7280" />
                          <Text style={styles.metaText}>{item.duration}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="download-outline" size={14} color="#6B7280" />
                          <Text style={styles.metaText}>{item.size}</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{item.progress}%</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.downloadActions}>
                    {item.progress === 100 ? (
                      <>
                        <TouchableOpacity style={styles.iconButton}>
                          <Ionicons name="play-circle" size={24} color="#6366F1" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                          <Ionicons name="trash-outline" size={24} color="#EF4444" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="pause-circle" size={24} color="#F59E0B" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366F1" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Manage Your Downloads</Text>
            <Text style={styles.infoText}>
              Downloaded content is available offline. You can delete downloads anytime to free up space.
            </Text>
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
  storageCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  storageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  storageIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  storageInfo: { flex: 1 },
  storageTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 2 },
  storageValue: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  storageBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  storageProgress: { height: '100%', backgroundColor: '#6366F1' },
  storageText: { fontSize: 12, color: '#6B7280' },
  actionsContainer: { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  actionButtonText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1F2937' },
  actionValue: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#6366F1', padding: 2, justifyContent: 'center', alignItems: 'flex-end' },
  toggleActive: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  section: { paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  deleteAll: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  downloadsList: { gap: 16 },
  downloadCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  downloadInfo: { flex: 1 },
  courseTitle: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#6B7280' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6366F1' },
  progressText: { fontSize: 12, fontWeight: '700', color: '#6366F1', width: 35 },
  downloadActions: { flexDirection: 'row', gap: 8 },
  iconButton: { padding: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', margin: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16, gap: 12 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#4338CA', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#4338CA', lineHeight: 20 },
  bottomSpacing: { height: 40 },
});
