import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Skill {
  id: string;
  name: string;
}

export default function UploadDocumentationScreen() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: '',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: '',
  });
  const [docFile, setDocFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data } = await supabase
        .from('skills')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (data) setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setDocFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document file');
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setThumbnailFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick thumbnail image');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.skillId) {
      newErrors.skillId = 'Please select a skill';
    }

    if (!docFile) {
      newErrors.document = 'Please select a document file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (file: any, bucket: string, folder: string) => {
    const fileExt = file.name?.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // For React Native, we need to create a FormData object
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.mimeType,
      name: fileName,
    } as any);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, formData);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    try {
      // Upload document file
      const docPath = await uploadFile(docFile, 'content', 'documents');
      const { data: { publicUrl: docUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(docPath);

      // Upload thumbnail if provided
      let thumbnailUrl: string | null = null;
      if (thumbnailFile) {
        const thumbnailPath = await uploadFile(thumbnailFile, 'content', 'thumbnails');
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = publicUrl;
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Save to database
      const { error } = await (supabase as any)
        .from('learning_content')
        .insert({
          title: formData.title,
          description: formData.description,
          skill_id: formData.skillId,
          creator_id: user?.id,
          type: 'documentation',
          content_url: docUrl,
          thumbnail_url: thumbnailUrl,
          skill_level: formData.skillLevel,
          tags: tags.length > 0 ? tags : null,
          status: 'pending_review',
        });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Documentation uploaded successfully! It will be reviewed before being published.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload documentation. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getFileTypeIcon = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      case 'md':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <ThemedText type="title" style={styles.headerTitle}>
            Upload Documentation
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Share guides, tutorials, and learning resources
          </ThemedText>
        </View>

        <View style={styles.form}>
          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter documentation title"
              maxLength={100}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description ? styles.inputError : null]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe what learners will learn from this documentation"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Skill Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Skill Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skillSelector}>
              {skills.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillChip,
                    formData.skillId === skill.id && styles.skillChipSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, skillId: skill.id }))}
                >
                  <Text style={[
                    styles.skillChipText,
                    formData.skillId === skill.id && styles.skillChipTextSelected
                  ]}>
                    {skill.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.skillId && <Text style={styles.errorText}>{errors.skillId}</Text>}
          </View>

          {/* Skill Level */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Skill Level</Text>
            <View style={styles.levelSelector}>
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    formData.skillLevel === level && styles.levelButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, skillLevel: level as any }))}
                >
                  <Text style={[
                    styles.levelButtonText,
                    formData.skillLevel === level && styles.levelButtonTextSelected
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tags (optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.tags}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tags: text }))}
              placeholder="Enter tags separated by commas (e.g., guide, tutorial, beginner)"
            />
          </View>

          {/* Document File */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Document File *</Text>
            <Text style={styles.helperText}>
              Supported formats: PDF, DOC, DOCX, TXT, MD
            </Text>
            <TouchableOpacity
              style={[styles.fileButton, errors.document ? styles.fileButtonError : null]}
              onPress={pickDocument}
            >
              <Text style={styles.fileButtonText}>
                {docFile ? `${getFileTypeIcon(docFile.name)} ${docFile.name}` : '📄 Select Document File'}
              </Text>
            </TouchableOpacity>
            {errors.document && <Text style={styles.errorText}>{errors.document}</Text>}
          </View>

          {/* Thumbnail */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Thumbnail (optional)</Text>
            <Text style={styles.helperText}>
              Add a cover image to make your documentation more appealing
            </Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickThumbnail}>
              <Text style={styles.fileButtonText}>
                {thumbnailFile ? '🖼️ Thumbnail Selected' : '🖼️ Select Thumbnail'}
              </Text>
            </TouchableOpacity>
            {thumbnailFile && (
              <Image source={{ uri: thumbnailFile.uri }} style={styles.thumbnailPreview} />
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.submitButtonText}>
              {uploading ? 'Uploading...' : 'Upload Documentation'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  skillSelector: {
    flexDirection: 'row',
  },
  skillChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  skillChipSelected: {
    backgroundColor: '#007AFF',
  },
  skillChipText: {
    fontSize: 14,
    color: '#333',
  },
  skillChipTextSelected: {
    color: '#fff',
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: '#007AFF',
  },
  levelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  levelButtonTextSelected: {
    color: '#fff',
  },
  fileButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileButtonError: {
    borderColor: '#FF3B30',
  },
  fileButtonText: {
    fontSize: 16,
    color: '#333',
  },
  thumbnailPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
