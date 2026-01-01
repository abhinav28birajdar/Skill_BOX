/**
 * Study Timer Screen
 * Features: Pomodoro timer, focus sessions, break reminders
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIMER_MODES = [
  { id: 'focus', label: 'Focus', duration: 25 * 60, color: ['#6366F1', '#8B5CF6'] },
  { id: 'short', label: 'Short Break', duration: 5 * 60, color: ['#10B981', '#059669'] },
  { id: 'long', label: 'Long Break', duration: 15 * 60, color: ['#F59E0B', '#D97706'] },
];

const RECENT_SESSIONS = [
  { id: 1, date: 'Today', duration: 25, course: 'React Native', completed: true },
  { id: 2, date: 'Today', duration: 25, course: 'UI/UX Design', completed: true },
  { id: 3, date: 'Yesterday', duration: 25, course: 'JavaScript', completed: true },
  { id: 4, date: 'Yesterday', duration: 25, course: 'React Native', completed: false },
];

export default function StudyTimerScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentMode = TIMER_MODES.find(m => m.id === mode) || TIMER_MODES[0];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            return currentMode.duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.duration);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setIsRunning(false);
    const newModeData = TIMER_MODES.find(m => m.id === newMode);
    if (newModeData) setTimeLeft(newModeData.duration);
  };

  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={currentMode.color} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Timer</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mode Selector */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.modeSelector}>
          {TIMER_MODES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeButton, mode === m.id && styles.modeButtonActive]}
              onPress={() => handleModeChange(m.id)}
            >
              <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Timer Display */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.timerCard}>
          <LinearGradient colors={currentMode.color} style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>{currentMode.label}</Text>
          </LinearGradient>
          <View style={styles.progressRing}>
            <View style={[styles.progressFill, { height: `${progress}%` }]} />
          </View>
        </Animated.View>

        {/* Controls */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.controlButton} onPress={handleStart}>
              <LinearGradient colors={currentMode.color} style={styles.controlButtonGradient}>
                <Ionicons name="play" size={32} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.controlButtonGradient}>
                <Ionicons name="pause" size={32} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(400)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flame" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{sessions}</Text>
            <Text style={styles.statLabel}>Sessions Today</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(450)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{sessions * 25}m</Text>
            <Text style={styles.statLabel}>Focus Time</Text>
          </Animated.View>
        </View>

        {/* Recent Sessions */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.sessionsList}>
            {RECENT_SESSIONS.map((session, index) => (
              <View
                key={session.id}
                style={[styles.sessionItem, index > 0 && styles.sessionItemBorder]}
              >
                <View style={[styles.sessionIcon, !session.completed && styles.sessionIconIncomplete]}>
                  <Ionicons
                    name={session.completed ? 'checkmark-circle' : 'alert-circle'}
                    size={24}
                    color={session.completed ? '#10B981' : '#F59E0B'}
                  />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionCourse}>{session.course}</Text>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                </View>
                <Text style={styles.sessionDuration}>{session.duration}m</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  modeSelector: { flexDirection: 'row', padding: 20, gap: 12 },
  modeButton: { flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  modeButtonActive: { backgroundColor: '#6366F1' },
  modeText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  modeTextActive: { color: '#fff' },
  timerCard: { alignItems: 'center', padding: 40 },
  timerCircle: { width: 280, height: 280, borderRadius: 140, justifyContent: 'center', alignItems: 'center' },
  timerText: { fontSize: 64, fontWeight: '800', color: '#fff', marginBottom: 8 },
  timerLabel: { fontSize: 18, fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' },
  progressRing: { position: 'absolute', top: 40, width: 280, height: 280, borderRadius: 140, overflow: 'hidden' },
  progressFill: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, paddingHorizontal: 20 },
  controlButton: { borderRadius: 40, overflow: 'hidden' },
  controlButtonGradient: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  secondaryButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  section: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  sessionsList: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
  sessionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  sessionItemBorder: { borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  sessionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' },
  sessionIconIncomplete: { backgroundColor: '#FEF3C7' },
  sessionInfo: { flex: 1 },
  sessionCourse: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  sessionDate: { fontSize: 13, color: '#6B7280' },
  sessionDuration: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  bottomSpacing: { height: 20 },
});
