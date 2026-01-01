/**
 * Create Course - Step 1: Basic Info
 * Features: Course title, description, category, level
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Music'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function CreateCourseScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Course</Text>
        <Text style={styles.step}>Step 1/5</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: '20%' }]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Basic Information</Text>
        <Text style={styles.pageSubtitle}>Let's start with the fundamentals of your course</Text>

        {/* Course Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Complete React Native Masterclass"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Short Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what students will learn in this course..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.chipsContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.chip, selectedCategory === category && styles.chipSelected]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.chipText, selectedCategory === category && styles.chipTextSelected]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Level */}
        <View style={styles.field}>
          <Text style={styles.label}>Course Level *</Text>
          <View style={styles.chipsContainer}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.chip, selectedLevel === level && styles.chipSelected]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={[styles.chipText, selectedLevel === level && styles.chipTextSelected]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  step: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  progressBar: { height: 4, backgroundColor: '#E5E7EB' },
  progressFill: { height: '100%' },
  content: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  pageSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 32 },
  field: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  input: { padding: 16, backgroundColor: '#fff', borderRadius: 12, fontSize: 15, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginTop: 4 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  chipSelected: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  chipTextSelected: { color: '#6366F1' },
  bottomSpacing: { height: 40 },
  bottomBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  secondaryButton: { flex: 1, paddingVertical: 14, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  primaryButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  primaryGradient: { flexDirection: 'row', paddingVertical: 14, justifyContent: 'center', alignItems: 'center', gap: 6 },
  primaryButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
