/**
 * Notifications Center
 * Features: All notifications, filter by type, mark as read
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'course',
    icon: 'book',
    title: 'New lesson available',
    message: 'React Native Masterclass has a new lesson: "Advanced Navigation"',
    time: '5m ago',
    read: false,
    color: '#6366F1',
  },
  {
    id: 2,
    type: 'achievement',
    icon: 'trophy',
    title: 'Achievement unlocked!',
    message: 'You earned "7-Day Streak" badge. Keep it up!',
    time: '1h ago',
    read: false,
    color: '#F59E0B',
  },
  {
    id: 3,
    type: 'social',
    icon: 'people',
    title: 'New group invitation',
    message: 'Sarah Chen invited you to join "React Native Developers" study group',
    time: '2h ago',
    read: false,
    color: '#10B981',
  },
  {
    id: 4,
    type: 'message',
    icon: 'chatbubble',
    title: 'New message',
    message: 'Marcus Johnson sent you a message',
    time: '3h ago',
    read: true,
    color: '#8B5CF6',
  },
  {
    id: 5,
    type: 'payment',
    icon: 'card',
    title: 'Payment successful',
    message: 'Your payment of $49.99 for "Advanced TypeScript" was successful',
    time: '1d ago',
    read: true,
    color: '#10B981',
  },
];

const NOTIFICATION_TYPES = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'course', label: 'Courses', count: 1 },
  { id: 'social', label: 'Social', count: 1 },
  { id: 'achievement', label: 'Achievements', count: 1 },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('all');

  const filteredNotifications =
    selectedType === 'all'
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) => n.type === selectedType);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadText}>{unreadCount} unread notifications</Text>
            <TouchableOpacity>
              <Text style={styles.markAllRead}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {NOTIFICATION_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterTab, selectedType === type.id && styles.filterTabActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={[styles.filterText, selectedType === type.id && styles.filterTextActive]}>
              {type.label}
            </Text>
            {type.count > 0 && (
              <View style={[styles.filterBadge, selectedType === type.id && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, selectedType === type.id && styles.filterBadgeTextActive]}>
                  {type.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotifications.map((notification, index) => (
          <Animated.View key={notification.id} entering={FadeInDown.delay(index * 50)}>
            <TouchableOpacity
              style={[styles.notificationCard, !notification.read && styles.notificationUnread]}
            >
              <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}15` }]}>
                <Ionicons name={notification.icon as any} size={24} color={notification.color} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  unreadBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  unreadText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  markAllRead: { fontSize: 13, fontWeight: '700', color: '#fff' },
  filterContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filterTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#F9FAFB', borderRadius: 20, gap: 6 },
  filterTabActive: { backgroundColor: '#6366F1' },
  filterText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  filterTextActive: { color: '#fff' },
  filterBadge: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#E5E7EB', borderRadius: 10 },
  filterBadgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filterBadgeText: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  filterBadgeTextActive: { color: '#fff' },
  content: { flex: 1 },
  notificationCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
  notificationUnread: { backgroundColor: '#EEF2FF' },
  notificationIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  notificationMessage: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 4 },
  notificationTime: { fontSize: 12, color: '#9CA3AF' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366F1', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
