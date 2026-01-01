/**
 * Study Reminders Screen
 * Features: Schedule reminders, notification settings
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const REMINDERS = [
  {
    id: 1,
    title: 'Daily Learning Goal',
    description: 'Study for at least 30 minutes',
    time: '09:00 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    icon: 'book',
    color: '#6366F1',
  },
  {
    id: 2,
    title: 'Evening Review',
    description: 'Review today\'s lessons',
    time: '07:00 PM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    icon: 'refresh',
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Weekend Practice',
    description: 'Complete practice tests',
    time: '10:00 AM',
    days: ['Sat', 'Sun'],
    enabled: false,
    icon: 'clipboard',
    color: '#F59E0B',
  },
  {
    id: 4,
    title: 'Flashcard Review',
    description: 'Review flashcards',
    time: '12:00 PM',
    days: ['Mon', 'Wed', 'Fri'],
    enabled: true,
    icon: 'layers',
    color: '#EC4899',
  },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StudyRemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState(REMINDERS);

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const activeCount = reminders.filter((r) => r.enabled).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Reminders</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Ionicons name="notifications" size={32} color="#6366F1" />
          </View>
          <Text style={styles.statsValue}>{activeCount} Active Reminders</Text>
          <Text style={styles.statsText}>
            Stay on track with personalized study notifications
          </Text>
        </Animated.View>

        {/* Quick Settings */}
        <View style={styles.quickSettings}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="notifications" size={20} color="#3B82F6" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive reminder notifications
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
              thumbColor="#fff"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250)} style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="mail" size={20} color="#EF4444" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Reminders</Text>
                <Text style={styles.settingDescription}>Send reminders via email</Text>
              </View>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
              thumbColor="#fff"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="repeat" size={20} color="#10B981" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Smart Reminders</Text>
                <Text style={styles.settingDescription}>
                  Adjust based on your activity
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
              thumbColor="#fff"
            />
          </Animated.View>
        </View>

        {/* Reminders List */}
        <View style={styles.remindersList}>
          <Text style={styles.sectionTitle}>Your Reminders</Text>
          {reminders.map((reminder, index) => (
            <Animated.View
              key={reminder.id}
              entering={FadeInDown.delay(350 + index * 100)}
              style={[
                styles.reminderCard,
                { opacity: reminder.enabled ? 1 : 0.6 },
              ]}
            >
              <View style={styles.reminderHeader}>
                <View
                  style={[
                    styles.reminderIcon,
                    { backgroundColor: `${reminder.color}20` },
                  ]}
                >
                  <Ionicons
                    name={reminder.icon as any}
                    size={24}
                    color={reminder.color}
                  />
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{ false: '#E5E7EB', true: reminder.color }}
                  thumbColor="#fff"
                />
              </View>

              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderDescription}>{reminder.description}</Text>

              <View style={styles.reminderTime}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.reminderTimeText}>{reminder.time}</Text>
              </View>

              <View style={styles.daysContainer}>
                {WEEK_DAYS.map((day) => {
                  const isActive = reminder.days.includes(day);
                  return (
                    <View
                      key={day}
                      style={[
                        styles.dayChip,
                        {
                          backgroundColor: isActive
                            ? `${reminder.color}20`
                            : '#F3F4F6',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          { color: isActive ? reminder.color : '#9CA3AF' },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create-outline" size={16} color="#6366F1" />
                <Text style={styles.editButtonText}>Edit Reminder</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Add Reminder Button */}
        <Animated.View entering={FadeInDown.delay(750)}>
          <TouchableOpacity style={styles.addButton}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Create New Reminder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Tips Card */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.tipsCard}>
          <View style={styles.tipsIcon}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>💡 Reminder Tips</Text>
            <Text style={styles.tipsText}>
              • Set reminders for your most productive hours{'\n'}
              • Don't set too many - start with 2-3 daily reminders{'\n'}
              • Adjust times based on your schedule{'\n'}
              • Turn off reminders when taking breaks
            </Text>
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
  statsCard: { margin: 20, padding: 24, backgroundColor: '#fff', borderRadius: 24, alignItems: 'center' },
  statsIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statsValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  statsText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  quickSettings: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  settingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  settingDescription: { fontSize: 13, color: '#6B7280' },
  remindersList: { paddingHorizontal: 20, marginBottom: 20 },
  reminderCard: { padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12 },
  reminderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reminderIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  reminderTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  reminderDescription: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  reminderTime: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  reminderTimeText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  daysContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dayChip: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  dayText: { fontSize: 12, fontWeight: '800' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: '#EEF2FF', borderRadius: 12 },
  editButtonText: { fontSize: 14, fontWeight: '800', color: '#6366F1' },
  addButton: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  addButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  tipsCard: { flexDirection: 'row', marginHorizontal: 20, padding: 16, backgroundColor: '#FEF3C7', borderRadius: 16, gap: 12 },
  tipsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  tipsContent: { flex: 1 },
  tipsTitle: { fontSize: 15, fontWeight: '800', color: '#92400E', marginBottom: 8 },
  tipsText: { fontSize: 13, color: '#78350F', lineHeight: 20 },
  bottomSpacing: { height: 20 },
});
