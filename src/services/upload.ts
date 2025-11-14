import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { deleteFile, uploadFile } from './supabase';

class UploadService {
  // Request permissions
  async requestPermissions(): Promise<boolean> {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraStatus === 'granted' && mediaStatus === 'granted';
  }

  // Pick image from gallery
  async pickImage(options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<ImagePicker.ImagePickerAsset | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error: any) {
      console.error('Pick image error:', error);
      return null;
    }
  }

  // Take photo with camera
  async takePhoto(options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<ImagePicker.ImagePickerAsset | null> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [4, 3],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error: any) {
      console.error('Take photo error:', error);
      return null;
    }
  }

  // Pick video
  async pickVideo(): Promise<ImagePicker.ImagePickerAsset | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error: any) {
      console.error('Pick video error:', error);
      return null;
    }
  }

  // Pick document
  async pickDocument(types?: string[]): Promise<DocumentPicker.DocumentPickerAsset | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: types || ['application/pdf', 'application/msword', 'application/vnd.ms-powerpoint'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error: any) {
      console.error('Pick document error:', error);
      return null;
    }
  }

  // Upload avatar
  async uploadAvatar(uri: string, userId: string): Promise<string | null> {
    try {
      const fileName = `${userId}_${Date.now()}.jpg`;
      const publicUrl = await uploadFile('avatars', fileName, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      return null;
    }
  }

  // Upload course cover
  async uploadCourseCover(uri: string, courseId: string): Promise<string | null> {
    try {
      const fileName = `${courseId}_${Date.now()}.jpg`;
      const publicUrl = await uploadFile('course-covers', fileName, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload course cover error:', error);
      return null;
    }
  }

  // Upload course video
  async uploadCourseVideo(uri: string, courseId: string, lessonId: string): Promise<string | null> {
    try {
      const fileName = `${courseId}/${lessonId}_${Date.now()}.mp4`;
      const publicUrl = await uploadFile('course-videos', fileName, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload course video error:', error);
      return null;
    }
  }

  // Upload course document
  async uploadCourseDocument(
    uri: string,
    courseId: string,
    lessonId: string,
    fileName: string
  ): Promise<string | null> {
    try {
      const path = `${courseId}/${lessonId}_${Date.now()}_${fileName}`;
      const publicUrl = await uploadFile('course-documents', path, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload course document error:', error);
      return null;
    }
  }

  // Upload chat attachment
  async uploadChatAttachment(uri: string, threadId: string, type: string): Promise<string | null> {
    try {
      const ext = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf';
      const fileName = `${threadId}/${Date.now()}.${ext}`;
      const publicUrl = await uploadFile('chat-attachments', fileName, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload chat attachment error:', error);
      return null;
    }
  }

  // Upload showcase media
  async uploadShowcase(uri: string, studentId: string, type: string): Promise<string | null> {
    try {
      const ext = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf';
      const fileName = `${studentId}/${Date.now()}.${ext}`;
      const publicUrl = await uploadFile('showcases', fileName, uri);
      return publicUrl;
    } catch (error: any) {
      console.error('Upload showcase error:', error);
      return null;
    }
  }

  // Delete file from storage
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      await deleteFile(bucket, path);
      return true;
    } catch (error: any) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  // Get file size in MB
  getFileSizeMB(uri: string): number {
    // This would need platform-specific implementation
    // For now, return 0
    return 0;
  }

  // Validate file size
  isValidFileSize(sizeMB: number, maxSizeMB: number): boolean {
    return sizeMB <= maxSizeMB;
  }

  // Validate image dimensions
  async validateImageDimensions(
    uri: string,
    minWidth: number,
    minHeight: number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width >= minWidth && img.height >= minHeight);
      };
      img.onerror = () => resolve(false);
      img.src = uri;
    });
  }
}

export default new UploadService();
