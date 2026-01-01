/**
 * Course Creation Wizard - Step 2: Curriculum Builder
 * Features: Add sections, lessons, reorder content
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  duration: number;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CreateCourseStep2Screen() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: 'Introduction',
      lessons: [
        { id: 1, title: 'Welcome to the Course', type: 'video', duration: 5 },
        { id: 2, title: 'Course Overview', type: 'video', duration: 8 },
      ],
    },
  ]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle';
      case 'quiz': return 'help-circle';
      case 'reading': return 'book';
      case 'assignment': return 'document-text';
      default: return 'document';
    }
  };

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (sum, s) => sum + s.lessons.reduce((ls, l) => ls + l.duration, 0),
    0
  );

  const handleAddSection = () => {
    if (sectionTitle.trim()) {
      setSections([...sections, { id: Date.now(), title: sectionTitle, lessons: [] }]);
      setSectionTitle('');
      setShowAddSection(false);
    }
  };

  const handleAddLesson = () => {
    if (lessonTitle.trim() && selectedSection) {
      setSections(
        sections.map((section) =>
          section.id === selectedSection
            ? {
                ...section,
                lessons: [
                  ...section.lessons,
                  { id: Date.now(), title: lessonTitle, type: 'video', duration: 10 },
                ],
              }
            : section
        )
      );
      setLessonTitle('');
      setShowAddLesson(false);
    }
  };

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
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
        </View>
        <Text style={styles.progressTitle}>Step 2 of 5: Build Curriculum</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="albums-outline" size={24} color="#6366F1" />
            <Text style={styles.statValue}>{sections.length}</Text>
            <Text style={styles.statLabel}>Sections</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="play-circle-outline" size={24} color="#10B981" />
            <Text style={styles.statValue}>{totalLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{totalDuration}m</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Curriculum */}
        <View style={styles.section}>
          {sections.map((section, sectionIndex) => (
            <Animated.View
              key={section.id}
              entering={FadeInDown.delay(sectionIndex * 100)}
              style={styles.sectionCard}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLeft}>
                  <Ionicons name="reorder-three" size={24} color="#9CA3AF" />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSection(section.id);
                    setShowAddLesson(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#6366F1" />
                </TouchableOpacity>
              </View>

              {section.lessons.map((lesson, lessonIndex) => (
                <View key={lesson.id} style={styles.lessonRow}>
                  <Ionicons name="reorder-two" size={20} color="#D1D5DB" />
                  <View style={styles.lessonIcon}>
                    <Ionicons name={getLessonIcon(lesson.type) as any} size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>{lesson.duration}m</Text>
                </View>
              ))}

              {section.lessons.length === 0 && (
                <Text style={styles.emptyLessons}>No lessons yet. Tap + to add.</Text>
              )}
            </Animated.View>
          ))}

          <TouchableOpacity style={styles.addSectionButton} onPress={() => setShowAddSection(true)}>
            <Ionicons name="add-circle" size={24} color="#6366F1" />
            <Text style={styles.addSectionText}>Add Section</Text>
          </TouchableOpacity>
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
          onPress={() => router.push('/instructor/courses/create-step3')}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Add Section Modal */}
      <Modal visible={showAddSection} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Section</Text>
              <TouchableOpacity onPress={() => setShowAddSection(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Section title (e.g., 'Getting Started')"
              value={sectionTitle}
              onChangeText={setSectionTitle}
              autoFocus
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddSection}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalGradient}
              >
                <Text style={styles.modalButtonText}>Add Section</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal visible={showAddLesson} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Lesson</Text>
              <TouchableOpacity onPress={() => setShowAddLesson(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Lesson title"
              value={lessonTitle}
              onChangeText={setLessonTitle}
              autoFocus
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddLesson}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalGradient}
              >
                <Text style={styles.modalButtonText}>Add Lesson</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  statsRow: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  section: { paddingHorizontal: 20 },
  sectionCard: { marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  lessonIcon: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  lessonTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  lessonDuration: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  emptyLessons: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingVertical: 12 },
  addSectionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', gap: 8 },
  addSectionText: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  saveDraftButton: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12 },
  saveDraftText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  continueButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  continueGradient: { flexDirection: 'row', paddingVertical: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  continueText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  input: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 15, color: '#1F2937', marginBottom: 16 },
  modalButton: { borderRadius: 12, overflow: 'hidden' },
  modalGradient: { paddingVertical: 14, alignItems: 'center' },
  modalButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
