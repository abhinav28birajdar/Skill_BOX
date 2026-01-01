/**
 * Video Lesson Player
 * Features: Full-screen video, custom controls, speed, quality, captions, notes, bookmarks, PIP
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VideoLessonPlayer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [quality, setQuality] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);

  const lesson = {
    title: 'Setting Up Development Environment',
    duration: '12:45',
    currentTime: '5:23',
    progress: 42,
    nextLesson: 'Your First React Native App',
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Video Player Area */}
      <View style={styles.videoContainer}>
        <LinearGradient colors={['#000', '#1F2937']} style={styles.videoPlaceholder}>
          {/* Top Controls */}
          {showControls && (
            <View style={styles.topControls}>
              <TouchableOpacity onPress={() => router.back()} style={styles.controlButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.topRight}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="expand-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Center Play Button */}
          <TouchableOpacity style={styles.centerPlay} onPress={() => setIsPlaying(!isPlaying)}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="#fff" />
          </TouchableOpacity>

          {/* Bottom Controls */}
          {showControls && (
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
                </View>
                <Text style={styles.timeText}>{lesson.currentTime} / {lesson.duration}</Text>
              </View>

              {/* Control Buttons */}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="refresh" size={24} color="#fff" />
                  <Text style={styles.controlLabel}>-10s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mainPlayButton} onPress={() => setIsPlaying(!isPlaying)}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="refresh" size={24} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
                  <Text style={styles.controlLabel}>+10s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-forward" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Additional Controls */}
              <View style={styles.additionalControls}>
                <TouchableOpacity style={styles.speedButton}>
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="closed-captioning-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="videocam-outline" size={24} color="#fff" />
                  <Text style={styles.controlLabel}>{quality}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Lesson Info & Tabs */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonTitleRow}>
            <View style={styles.lessonTitleContainer}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={24} color="#6366F1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push(`/lessons/${id}/notes`)}>
            <Ionicons name="create-outline" size={20} color="#6366F1" />
            <Text style={styles.quickActionText}>Take Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="download-outline" size={20} color="#6366F1" />
            <Text style={styles.quickActionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push(`/lessons/${id}/resources`)}>
            <Ionicons name="document-text-outline" size={20} color="#6366F1" />
            <Text style={styles.quickActionText}>Resources</Text>
          </TouchableOpacity>
        </View>

        {/* Up Next */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <TouchableOpacity style={styles.nextLesson}>
            <View style={styles.nextLessonThumb}>
              <Ionicons name="play" size={24} color="#fff" />
            </View>
            <View style={styles.nextLessonInfo}>
              <Text style={styles.nextLessonTitle}>{lesson.nextLesson}</Text>
              <Text style={styles.nextLessonDuration}>15:30</Text>
            </View>
            <TouchableOpacity style={styles.autoplayButton}>
              <Ionicons name="play-circle" size={32} color="#6366F1" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { width: width, height: width * 0.56 },
  videoPlaceholder: { width: '100%', height: '100%', justifyContent: 'space-between' },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  topRight: { flexDirection: 'row', gap: 12 },
  controlButton: { alignItems: 'center' },
  controlLabel: { fontSize: 10, color: '#fff', marginTop: 2 },
  centerPlay: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  bottomControls: { padding: 16 },
  progressContainer: { marginBottom: 12 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 2 },
  timeText: { fontSize: 12, color: '#fff', textAlign: 'right' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginBottom: 12 },
  mainPlayButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  additionalControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  speedButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  speedText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  content: { flex: 1, backgroundColor: '#fff' },
  lessonHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  lessonTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  lessonTitleContainer: { flex: 1 },
  lessonTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  lessonDuration: { fontSize: 14, color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  quickActions: { flexDirection: 'row', padding: 20, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 12, gap: 6 },
  quickActionText: { fontSize: 13, fontWeight: '600', color: '#6366F1' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  nextLesson: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, gap: 12 },
  nextLessonThumb: { width: 60, height: 40, borderRadius: 8, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  nextLessonInfo: { flex: 1 },
  nextLessonTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  nextLessonDuration: { fontSize: 13, color: '#6B7280' },
  autoplayButton: {},
});
