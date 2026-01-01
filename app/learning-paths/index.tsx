/**
 * Learning Paths Page
 * Features: Curated skill progression paths, career tracks
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const LEARNING_PATHS = [
  {
    id: 1,
    title: 'Full Stack Developer',
    description: 'Complete path from beginner to professional full stack developer',
    icon: 'code-slash',
    color: '#6366F1',
    courses: 12,
    duration: 180,
    level: 'Beginner to Advanced',
    students: 15234,
    progress: 35,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    description: 'Master design principles and create stunning user experiences',
    icon: 'color-palette',
    color: '#EC4899',
    courses: 8,
    duration: 120,
    level: 'Beginner',
    students: 12456,
    progress: 0,
  },
  {
    id: 3,
    title: 'Data Scientist',
    description: 'Learn data analysis, machine learning, and AI fundamentals',
    icon: 'bar-chart',
    color: '#10B981',
    courses: 15,
    duration: 200,
    level: 'Intermediate',
    students: 9876,
    progress: 0,
  },
  {
    id: 4,
    title: 'Mobile Developer',
    description: 'Build iOS and Android apps with React Native and Flutter',
    icon: 'phone-portrait',
    color: '#F59E0B',
    courses: 10,
    duration: 150,
    level: 'Intermediate',
    students: 11234,
    progress: 60,
  },
];

const PATH_SKILLS = [
  { id: 1, name: 'HTML & CSS', completed: true },
  { id: 2, name: 'JavaScript', completed: true },
  { id: 3, name: 'React', completed: false },
  { id: 4, name: 'Node.js', completed: false },
  { id: 5, name: 'Databases', completed: false },
];

export default function LearningPathsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Paths</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Choose Your Career Path</Text>
          <Text style={styles.introSubtitle}>
            Follow structured learning paths designed by industry experts to master in-demand skills
          </Text>
        </View>

        {/* Learning Paths */}
        <View style={styles.section}>
          {LEARNING_PATHS.map((path, index) => (
            <Animated.View key={path.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity style={styles.pathCard}>
                <View style={[styles.pathIconContainer, { backgroundColor: `${path.color}15` }]}>
                  <Ionicons name={path.icon as any} size={32} color={path.color} />
                </View>

                <View style={styles.pathContent}>
                  <Text style={styles.pathTitle}>{path.title}</Text>
                  <Text style={styles.pathDescription}>{path.description}</Text>

                  <View style={styles.pathMeta}>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="book-outline" size={16} color="#6B7280" />
                      <Text style={styles.pathMetaText}>{path.courses} courses</Text>
                    </View>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.pathMetaText}>{path.duration}h</Text>
                    </View>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="people-outline" size={16} color="#6B7280" />
                      <Text style={styles.pathMetaText}>{(path.students / 1000).toFixed(1)}K</Text>
                    </View>
                  </View>

                  <View style={styles.pathLevel}>
                    <Text style={styles.pathLevelText}>{path.level}</Text>
                  </View>

                  {path.progress > 0 && (
                    <View style={styles.progressSection}>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={[path.color, path.color]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.progressFill, { width: `${path.progress}%` }]}
                        />
                      </View>
                      <Text style={styles.progressText}>{path.progress}% complete</Text>
                    </View>
                  )}

                  <TouchableOpacity style={[styles.pathButton, { backgroundColor: `${path.color}15` }]}>
                    <Text style={[styles.pathButtonText, { color: path.color }]}>
                      {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={path.color} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

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
  introCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  introTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  introSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  section: { paddingHorizontal: 20, gap: 16 },
  pathCard: { padding: 20, backgroundColor: '#fff', borderRadius: 20 },
  pathIconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  pathContent: { flex: 1 },
  pathTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  pathDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  pathMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  pathMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pathMetaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  pathLevel: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 16 },
  pathLevelText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  progressSection: { marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%' },
  progressText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  pathButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 6 },
  pathButtonText: { fontSize: 15, fontWeight: '700' },
  bottomSpacing: { height: 40 },
});
