/**
 * Course Detail Page - Enhanced Version
 * Features: Course preview, curriculum, instructor info, reviews, enrollment
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const COURSE_DATA = {
  id: '1',
  title: 'Complete React Native Development 2024',
  subtitle: 'Build iOS & Android apps with React, Redux, Expo, and more',
  instructor: { name: 'Sarah Wilson', avatar: 'https://via.placeholder.com/60/667eea/ffffff?text=SW', title: 'Senior Mobile Developer', students: 45000, courses: 12, rating: 4.9 },
  rating: 4.9,
  reviewsCount: 12500,
  studentsCount: 45000,
  price: 89.99,
  thumbnail: 'https://via.placeholder.com/800x450/667eea/ffffff?text=React+Native',
  duration: '32 hours',
  lectures: 285,
  level: 'All Levels',
  language: 'English',
  lastUpdated: 'December 2024',
  whatYouLearn: [
    'Build professional mobile apps with React Native',
    'Master React hooks and component patterns',
    'Implement navigation and state management',
    'Work with APIs and async data',
    'Deploy apps to App Store and Play Store',
    'Implement push notifications and deep linking'
  ],
  requirements: ['Basic JavaScript knowledge', 'Computer with internet', 'Willingness to learn'],
  description: 'Master React Native development with this comprehensive course...',
  curriculum: [
    { id: '1', title: 'Introduction', lessons: 8, duration: '45min', lessons_list: [
      { id: '1-1', title: 'Welcome to the Course', duration: '5:30', type: 'video', isFree: true },
      { id: '1-2', title: 'Setting Up Development Environment', duration: '12:45', type: 'video', isFree: true },
      { id: '1-3', title: 'Your First React Native App', duration: '18:20', type: 'video', isFree: false },
    ]},
    { id: '2', title: 'React Fundamentals', lessons: 12, duration: '2h 15min', lessons_list: [] },
    { id: '3', title: 'React Native Components', lessons: 15, duration: '3h 30min', lessons_list: [] },
  ],
};

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expandedSection, setExpandedSection] = useState<string | null>('1');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Image */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image source={{ uri: COURSE_DATA.thumbnail }} style={styles.thumbnail} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.previewText}>Preview this course</Text>
          </LinearGradient>
        </View>

        {/* Course Info */}
        <View style={styles.contentSection}>
          <View style={styles.topBar}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Programming</Text>
            </View>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={24} color="#6366F1" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{COURSE_DATA.title}</Text>
          <Text style={styles.subtitle}>{COURSE_DATA.subtitle}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.statText}>{COURSE_DATA.rating} ({COURSE_DATA.reviewsCount.toLocaleString()})</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="people" size={16} color="#6B7280" />
              <Text style={styles.statText}>{COURSE_DATA.studentsCount.toLocaleString()} students</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="time" size={16} color="#6B7280" />
              <Text style={styles.statText}>{COURSE_DATA.duration}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What you'll learn</Text>
                <View style={styles.learnList}>
                  {COURSE_DATA.whatYouLearn.map((item, index) => (
                    <View key={index} style={styles.learnItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.learnText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                {COURSE_DATA.requirements.map((req, index) => (
                  <View key={index} style={styles.reqItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.reqText}>{req}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{COURSE_DATA.description}</Text>
              </View>
            </>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Content</Text>
              <Text style={styles.curriculumSummary}>{COURSE_DATA.curriculum.length} sections • {COURSE_DATA.lectures} lectures • {COURSE_DATA.duration}</Text>
              {COURSE_DATA.curriculum.map((section) => (
                <View key={section.id} style={styles.curriculumSection}>
                  <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}>
                    <View style={styles.sectionHeaderLeft}>
                      <Ionicons name={expandedSection === section.id ? 'chevron-down' : 'chevron-forward'} size={20} color="#1F2937" />
                      <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
                    </View>
                    <Text style={styles.sectionHeaderInfo}>{section.lessons} lectures • {section.duration}</Text>
                  </TouchableOpacity>
                  {expandedSection === section.id && section.lessons_list.map((lesson) => (
                    <View key={lesson.id} style={styles.lessonItem}>
                      <Ionicons name={lesson.type === 'video' ? 'play-circle-outline' : 'document-text-outline'} size={20} color="#6B7280" />
                      <Text style={[styles.lessonTitle, !lesson.isFree && styles.lessonLocked]}>{lesson.title}</Text>
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                      {lesson.isFree && <View style={styles.freeBadge}><Text style={styles.freeText}>Free</Text></View>}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructor</Text>
              <TouchableOpacity style={styles.instructorCard} onPress={() => router.push(`/instructors/${COURSE_DATA.instructor.name}`)}>
                <Image source={{ uri: COURSE_DATA.instructor.avatar }} style={styles.instructorAvatar} />
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{COURSE_DATA.instructor.name}</Text>
                  <Text style={styles.instructorTitle}>{COURSE_DATA.instructor.title}</Text>
                  <View style={styles.instructorStats}>
                    <Text style={styles.instructorStat}>⭐ {COURSE_DATA.instructor.rating} Rating</Text>
                    <Text style={styles.instructorStat}>👥 {COURSE_DATA.instructor.students.toLocaleString()} Students</Text>
                    <Text style={styles.instructorStat}>📚 {COURSE_DATA.instructor.courses} Courses</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${COURSE_DATA.price}</Text>
        </View>
        <TouchableOpacity style={styles.enrollButton} onPress={() => router.push(`/courses/${id}/enroll`)}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.enrollGradient}>
            <Text style={styles.enrollText}>Enroll Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  heroSection: { position: 'relative', width: width, height: width * 0.56 },
  thumbnail: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', padding: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
  shareButton: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  playButton: { alignSelf: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  previewText: { color: '#fff', fontSize: 14, fontWeight: '600', alignSelf: 'center' },
  contentSection: { padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  categoryText: { color: '#6366F1', fontSize: 12, fontWeight: '700' },
  bookmarkButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#F3F4F6', marginBottom: 20 },
  tab: { paddingVertical: 12, paddingHorizontal: 16, marginRight: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#6366F1', marginBottom: -2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#6366F1' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  learnList: { gap: 12 },
  learnItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  learnText: { flex: 1, fontSize: 15, color: '#4B5563', lineHeight: 22 },
  reqItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9CA3AF', marginTop: 8 },
  reqText: { flex: 1, fontSize: 15, color: '#4B5563' },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  curriculumSummary: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  curriculumSection: { marginBottom: 12, backgroundColor: '#F9FAFB', borderRadius: 12, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  sectionHeaderInfo: { fontSize: 12, color: '#6B7280' },
  lessonItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, backgroundColor: '#fff' },
  lessonTitle: { flex: 1, fontSize: 14, color: '#1F2937' },
  lessonLocked: { color: '#9CA3AF' },
  lessonDuration: { fontSize: 12, color: '#6B7280' },
  freeBadge: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  freeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  instructorCard: { flexDirection: 'row', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, gap: 16 },
  instructorAvatar: { width: 80, height: 80, borderRadius: 40 },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  instructorTitle: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  instructorStats: { gap: 4 },
  instructorStat: { fontSize: 13, color: '#4B5563' },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 12 },
  priceContainer: { justifyContent: 'center' },
  price: { fontSize: 28, fontWeight: '800', color: '#6366F1' },
  enrollButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  enrollGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  enrollText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
