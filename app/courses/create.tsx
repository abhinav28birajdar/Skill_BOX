import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext.enhanced';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCourseScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    language_taught: 'English',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master',
    target_audience: '',
    prerequisites: '',
    what_you_will_learn: '',
  });

  const difficultyLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Expert', value: 'expert' },
    { label: 'Master', value: 'master' },
  ];

  const handleCreate = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a course');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const prerequisites = formData.prerequisites 
        ? formData.prerequisites.split('\n').filter(p => p.trim())
        : [];
      
      const whatYouWillLearn = formData.what_you_will_learn
        ? formData.what_you_will_learn.split('\n').filter(w => w.trim())
        : [];

      const { data, error } = await supabase
        .from('courses')
        .insert({
          creator_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price) || 0,
          language_taught: formData.language_taught,
          difficulty_level: formData.difficulty_level,
          target_audience: formData.target_audience.trim() || null,
          prerequisites: prerequisites.length > 0 ? prerequisites : null,
          what_you_will_learn: whatYouWillLearn.length > 0 ? whatYouWillLearn : null,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Course created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace(`/courses/${data.id}`)
        }
      ]);
    } catch (error) {
      console.error('Error creating course:', error);
      Alert.alert('Error', 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Course</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Enter course title"
            maxLength={100}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describe your course..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Price (USD)</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00 (Leave empty for free)"
            keyboardType="decimal-pad"
          />
          <Text style={styles.hint}>Set to 0 or leave empty for a free course</Text>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Language</Text>
          <TextInput
            style={styles.input}
            value={formData.language_taught}
            onChangeText={(text) => setFormData({ ...formData, language_taught: text })}
            placeholder="Course language"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.radioGroup}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, difficulty_level: level.value as any })}
              >
                <View style={[
                  styles.radioCircle,
                  formData.difficulty_level === level.value && styles.radioSelected
                ]}>
                  {formData.difficulty_level === level.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{level.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Target Audience</Text>
          <TextInput
            style={styles.input}
            value={formData.target_audience}
            onChangeText={(text) => setFormData({ ...formData, target_audience: text })}
            placeholder="Who is this course for?"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>Prerequisites</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.prerequisites}
            onChangeText={(text) => setFormData({ ...formData, prerequisites: text })}
            placeholder="List prerequisites (one per line)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>Enter each prerequisite on a new line</Text>
        </ThemedView>

        <ThemedView style={styles.section}>
          <Text style={styles.label}>What You Will Learn</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.what_you_will_learn}
            onChangeText={(text) => setFormData({ ...formData, what_you_will_learn: text })}
            placeholder="List learning outcomes (one per line)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>Enter each learning outcome on a new line</Text>
        </ThemedView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Course</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
