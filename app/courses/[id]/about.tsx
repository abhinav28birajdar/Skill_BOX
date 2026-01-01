/**
 * Course About Tab
 * Features: Course overview, requirements, instructor bio
 */

import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const INSTRUCTOR = {
  name: 'John Doe',
  title: 'Senior Full Stack Developer',
  avatar: 'https://i.pravatar.cc/150?img=10',
  students: 45231,
  courses: 12,
  rating: 4.8,
  bio: 'Professional developer with 10+ years of experience in building web and mobile applications. Passionate about teaching and helping students achieve their goals.',
};

const REQUIREMENTS = [
  'Basic understanding of JavaScript',
  'Familiarity with React fundamentals',
  'Computer with internet connection',
  'Text editor or IDE installed',
];

const WHAT_YOU_LEARN = [
  'Build production-ready React Native applications',
  'Master advanced navigation patterns',
  'Integrate third-party APIs and services',
  'Implement authentication and state management',
  'Deploy apps to App Store and Play Store',
  'Optimize performance and user experience',
];

export default function CourseAboutTab() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Course Description */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
        <Text style={styles.sectionTitle}>About This Course</Text>
        <Text style={styles.description}>
          Master React Native by building real-world mobile applications from scratch. This comprehensive
          course covers everything from fundamentals to advanced topics including navigation, state
          management, animations, and deployment.
        </Text>
        <Text style={styles.description}>
          You'll build multiple projects throughout the course, including a social media app, e-commerce
          platform, and a productivity tool. By the end, you'll have a strong portfolio and the skills to
          build any mobile app you can imagine.
        </Text>
      </Animated.View>

      {/* What You'll Learn */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <Text style={styles.sectionTitle}>What You'll Learn</Text>
        <View style={styles.learnList}>
          {WHAT_YOU_LEARN.map((item, index) => (
            <View key={index} style={styles.learnItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              </View>
              <Text style={styles.learnText}>{item}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Requirements */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        <View style={styles.requirementsList}>
          {REQUIREMENTS.map((item, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Instructor */}
      <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Your Instructor</Text>
        <View style={styles.instructorCard}>
          <Image source={{ uri: INSTRUCTOR.avatar }} style={styles.instructorAvatar} />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{INSTRUCTOR.name}</Text>
            <Text style={styles.instructorTitle}>{INSTRUCTOR.title}</Text>
            
            <View style={styles.instructorStats}>
              <View style={styles.instructorStat}>
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text style={styles.instructorStatText}>
                  {(INSTRUCTOR.students / 1000).toFixed(1)}K students
                </Text>
              </View>
              <View style={styles.instructorStat}>
                <Ionicons name="book-outline" size={16} color="#6B7280" />
                <Text style={styles.instructorStatText}>{INSTRUCTOR.courses} courses</Text>
              </View>
              <View style={styles.instructorStat}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.instructorStatText}>{INSTRUCTOR.rating} rating</Text>
              </View>
            </View>

            <Text style={styles.instructorBio}>{INSTRUCTOR.bio}</Text>

            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Full Profile</Text>
              <Ionicons name="arrow-forward" size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  section: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 12 },
  learnList: { gap: 12 },
  learnItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkIcon: { marginTop: 2 },
  learnText: { flex: 1, fontSize: 15, color: '#1F2937', lineHeight: 22 },
  requirementsList: { gap: 12 },
  requirementItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B7280', marginTop: 8 },
  requirementText: { flex: 1, fontSize: 15, color: '#4B5563', lineHeight: 22 },
  instructorCard: { flexDirection: 'row', gap: 16 },
  instructorAvatar: { width: 80, height: 80, borderRadius: 40 },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  instructorTitle: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  instructorStats: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  instructorStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  instructorStatText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  instructorBio: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 12 },
  viewProfileButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  viewProfileText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  bottomSpacing: { height: 20 },
});
