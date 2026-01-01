/**
 * Lesson Resources Page
 * Features: Downloadable files, code samples, links
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_RESOURCES = [
  {
    type: 'document',
    title: 'React Native Fundamentals Guide.pdf',
    size: '2.4 MB',
    icon: 'document-text',
    color: '#EF4444',
  },
  {
    type: 'code',
    title: 'Lesson Source Code.zip',
    size: '1.8 MB',
    icon: 'code-slash',
    color: '#8B5CF6',
  },
  {
    type: 'link',
    title: 'Official React Native Documentation',
    url: 'reactnative.dev',
    icon: 'link',
    color: '#3B82F6',
  },
  {
    type: 'video',
    title: 'Bonus Tutorial: Advanced Hooks.mp4',
    size: '45.2 MB',
    icon: 'play-circle',
    color: '#10B981',
  },
  {
    type: 'document',
    title: 'Component Architecture Diagram.png',
    size: '856 KB',
    icon: 'image',
    color: '#F59E0B',
  },
];

const HELPFUL_LINKS = [
  { title: 'Expo Documentation', url: 'docs.expo.dev' },
  { title: 'GitHub Repository', url: 'github.com/example' },
  { title: 'Community Forum', url: 'community.example.com' },
];

export default function ResourcesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const getFileIcon = (icon: string) => icon as any;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson Resources</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Materials</Text>
          <View style={styles.resourcesList}>
            {MOCK_RESOURCES.map((resource, index) => (
              <Animated.View key={index} entering={FadeInDown.delay(index * 100)}>
                <TouchableOpacity style={styles.resourceCard}>
                  <View style={[styles.resourceIcon, { backgroundColor: resource.color + '20' }]}>
                    <Ionicons name={getFileIcon(resource.icon)} size={24} color={resource.color} />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceMeta}>
                      {resource.size || resource.url}
                    </Text>
                  </View>
                  <Ionicons name="download-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Helpful Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Helpful Links</Text>
          <View style={styles.linksList}>
            {HELPFUL_LINKS.map((link, index) => (
              <Animated.View key={index} entering={FadeInDown.delay((MOCK_RESOURCES.length + index) * 100)}>
                <TouchableOpacity style={styles.linkCard}>
                  <View style={styles.linkIcon}>
                    <Ionicons name="globe-outline" size={20} color="#6366F1" />
                  </View>
                  <View style={styles.linkInfo}>
                    <Text style={styles.linkTitle}>{link.title}</Text>
                    <Text style={styles.linkUrl}>{link.url}</Text>
                  </View>
                  <Ionicons name="open-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(900)} style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366F1" />
          <Text style={styles.infoText}>
            All resources are available for download and can be accessed offline. Files will be saved to your device.
          </Text>
        </Animated.View>

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
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  resourcesList: { gap: 12 },
  resourceCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  resourceIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  resourceMeta: { fontSize: 13, color: '#6B7280' },
  linksList: { gap: 12 },
  linkCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  linkIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  linkInfo: { flex: 1 },
  linkTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  linkUrl: { fontSize: 13, color: '#6366F1' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', margin: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16, gap: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#4338CA', lineHeight: 20 },
  bottomSpacing: { height: 40 },
});
