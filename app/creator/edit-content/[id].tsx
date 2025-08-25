import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LearningContent } from '@/types/database';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function EditContentScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [content, setContent] = useState<LearningContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: '',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: '',
  });
  const [newContentFile, setNewContentFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      loadContent();
      loadSkills();
    }
  }, [id]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_content')
        .select(`
          *,
          skills(name)
        `)
        .eq('id', id)
        .eq('creator_id', user?.id)
        .single();

      if (error) {
        Alert.alert('Error', 'Content not found or you do not have permission to edit it');
        router.back();
        return;
      }

      setContent(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        skillId: data.skill_id,
        skillLevel: data.skill_level || 'beginner',
        tags: data.tags?.join(', ') || '',
      });
    } catch (error) {
      console.error('Error loading content:', error);
      Alert.alert('Error', 'Failed to load content');
      router.back();
    } finally {
      setLoading(false);
    }
  };

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

  const pickContentFile = async () => {
    try {
      let result;
      if (content?.type === 'video') {
        result = await DocumentPicker.getDocumentAsync({
          type: 'video/*',
          copyToCacheDirectory: true,
        });
      } else if (content?.type === 'documentation') {
        result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          copyToCacheDirectory: true,
        });
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type: ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'],
          copyToCacheDirectory: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setNewContentFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
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
        setNewThumbnailFile(result.assets[0]);
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

  const handleUpdate = async () => {
    if (!validateForm() || !content) return;

    setUpdating(true);
    try {
      let updateData: any = {
        title: formData.title,
        description: formData.description,
        skill_id: formData.skillId,
        skill_level: formData.skillLevel,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        status: 'pending_review', // Reset to pending review after edit
      };

      // Upload new content file if provided
      if (newContentFile) {
        const contentPath = await uploadFile(
          newContentFile, 
          'content', 
          content.type === 'video' ? 'videos' : 
          content.type === 'documentation' ? 'documents' : 'projects'
        );
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(contentPath);
        updateData.content_url = publicUrl;
      }

      // Upload new thumbnail if provided
      if (newThumbnailFile) {
        const thumbnailPath = await uploadFile(newThumbnailFile, 'content', 'thumbnails');
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(thumbnailPath);
        updateData.thumbnail_url = publicUrl;
      }

      // If tags array is empty, set it to null
      if (updateData.tags.length === 0) {
        updateData.tags = null;
      }

      const { error } = await supabase
        .from('learning_content')
        .update(updateData)
        .eq('id', content.id);

      if (error) throw error;

      Alert.alert(
        'Success',
        'Content updated successfully! It will be reviewed before changes are published.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update content. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'documentation':
        return '📄';
      case 'project_resource':
        return '📦';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading content...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!content) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText>Content not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

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
            Edit {getContentTypeIcon(content.type)} {content.title}
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Update your content and resubmit for review
          </ThemedText>
        </View>

        <View style={styles.form}>
          {/* Current Status */}
          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(content.status) }]}>
              <Text style={styles.statusText}>{getStatusText(content.status)}</Text>
            </View>
          </View>

          {/* Rejection Reason */}
          {content.rejection_reason && content.status === 'rejected' && (
            <View style={styles.rejectionSection}>
              <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
              <Text style={styles.rejectionText}>{content.rejection_reason}</Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter title"
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
              placeholder="Describe your content"
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
              placeholder="Enter tags separated by commas"
            />
          </View>

          {/* Replace Content File */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Replace {content.type === 'video' ? 'Video' : content.type === 'documentation' ? 'Document' : 'Project'} File (optional)</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickContentFile}>
              <Text style={styles.fileButtonText}>
                {newContentFile 
                  ? `${getContentTypeIcon(content.type)} ${newContentFile.name}` 
                  : `${getContentTypeIcon(content.type)} Select New ${content.type === 'video' ? 'Video' : content.type === 'documentation' ? 'Document' : 'Project'} File`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Replace Thumbnail */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Replace Thumbnail (optional)</Text>
            <TouchableOpacity style={styles.fileButton} onPress={pickThumbnail}>
              <Text style={styles.fileButtonText}>
                {newThumbnailFile ? '🖼️ New Thumbnail Selected' : '🖼️ Select New Thumbnail'}
              </Text>
            </TouchableOpacity>
            {newThumbnailFile && (
              <Image source={{ uri: newThumbnailFile.uri }} style={styles.thumbnailPreview} />
            )}
            {content.thumbnail_url && !newThumbnailFile && (
              <View style={styles.currentThumbnail}>
                <Text style={styles.currentThumbnailLabel}>Current Thumbnail:</Text>
                <Image source={{ uri: content.thumbnail_url }} style={styles.thumbnailPreview} />
              </View>
            )}
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={handleUpdate}
            disabled={updating}
          >
            <Text style={styles.updateButtonText}>
              {updating ? 'Updating...' : 'Update Content'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'approved':
      return '#4CAF50';
    case 'pending_review':
      return '#FF9800';
    case 'rejected':
      return '#F44336';
    case 'draft':
      return '#9E9E9E';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case 'approved':
      return '✅ Live';
    case 'pending_review':
      return '⏳ Pending Review';
    case 'rejected':
      return '❌ Rejected';
    case 'draft':
      return '📝 Draft';
    default:
      return status || 'Unknown';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 24,
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
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  rejectionSection: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  rejectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 14,
    color: '#d32f2f',
    lineHeight: 20,
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
  currentThumbnail: {
    marginTop: 8,
  },
  currentThumbnailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
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
