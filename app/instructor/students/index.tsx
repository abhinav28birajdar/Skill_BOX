/**
 * Instructor Students Management
 * Features: Student list, progress tracking, messaging
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const STUDENTS = [
  { id: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1', course: 'React Native Masterclass', progress: 78, lastActive: '2 hours ago', enrolled: '2 weeks ago' },
  { id: 2, name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=2', course: 'Advanced TypeScript', progress: 92, lastActive: '1 day ago', enrolled: '1 month ago' },
  { id: 3, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=3', course: 'React Native Masterclass', progress: 45, lastActive: '5 hours ago', enrolled: '3 days ago' },
  { id: 4, name: 'Alex Kumar', avatar: 'https://i.pravatar.cc/150?img=4', course: 'UI/UX Design Basics', progress: 65, lastActive: '3 hours ago', enrolled: '1 week ago' },
];

export default function InstructorStudentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'active', 'struggling', 'completed'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Students</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{STUDENTS.length}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>67%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
        </View>

        {/* Students List */}
        <View style={styles.studentsList}>
          {STUDENTS.map((student, index) => (
            <Animated.View key={student.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity style={styles.studentCard}>
                <Image source={{ uri: student.avatar }} style={styles.avatar} />
                <View style={styles.studentInfo}>
                  <View style={styles.studentHeader}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <TouchableOpacity>
                      <Ionicons name="chatbubble-outline" size={20} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.courseName}>{student.course}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${student.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{student.progress}%</Text>
                  </View>
                  <View style={styles.studentFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.footerText}>{student.lastActive}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.footerText}>Enrolled {student.enrolled}</Text>
                    </View>
                  </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTextActive: { color: '#6366F1' },
  content: { flex: 1 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  statBox: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  studentsList: { paddingHorizontal: 20, gap: 16 },
  studentCard: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  studentInfo: { flex: 1 },
  studentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  courseName: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6366F1' },
  progressText: { fontSize: 12, fontWeight: '700', color: '#6366F1', width: 40 },
  studentFooter: { flexDirection: 'row', gap: 16 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
