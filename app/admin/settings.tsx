/**
 * Admin Settings Screen
 * Features: Platform configuration, system settings
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SYSTEM_SETTINGS = [
  { id: 1, key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Put platform in maintenance mode', icon: 'construct-outline', enabled: false },
  { id: 2, key: 'newRegistrations', label: 'New Registrations', description: 'Allow new user registrations', icon: 'person-add-outline', enabled: true },
  { id: 3, key: 'coursePublishing', label: 'Course Publishing', description: 'Allow instructors to publish courses', icon: 'book-outline', enabled: true },
  { id: 4, key: 'payments', label: 'Payments', description: 'Enable payment processing', icon: 'card-outline', enabled: true },
  { id: 5, key: 'emailNotifications', label: 'Email Notifications', description: 'Send automated email notifications', icon: 'mail-outline', enabled: true },
  { id: 6, key: 'pushNotifications', label: 'Push Notifications', description: 'Send push notifications to apps', icon: 'notifications-outline', enabled: true },
];

const PLATFORM_STATS = [
  { id: 1, label: 'Total Users', value: '156,234', icon: 'people', color: '#6366F1' },
  { id: 2, label: 'Active Courses', value: '1,542', icon: 'book', color: '#10B981' },
  { id: 3, label: 'Revenue (Month)', value: '$245K', icon: 'cash', color: '#F59E0B' },
  { id: 4, label: 'Server Load', value: '42%', icon: 'speedometer', color: '#EC4899' },
];

const ADMIN_ACTIONS = [
  { id: 1, label: 'User Management', description: 'Manage all platform users', icon: 'people-outline', route: '/admin/users', color: '#6366F1' },
  { id: 2, label: 'Content Moderation', description: 'Review flagged content', icon: 'flag-outline', route: '/admin/moderation', color: '#EF4444' },
  { id: 3, label: 'Analytics Dashboard', description: 'View platform analytics', icon: 'analytics-outline', route: '/admin/analytics', color: '#10B981' },
  { id: 4, label: 'System Logs', description: 'View system activity logs', icon: 'list-outline', route: '/admin/logs', color: '#F59E0B' },
];

export default function AdminSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(
    SYSTEM_SETTINGS.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.enabled }), {})
  );

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Platform Stats */}
        <View style={styles.statsGrid}>
          {PLATFORM_STATS.map((stat, index) => (
            <Animated.View
              key={stat.id}
              entering={FadeInDown.delay(index * 100)}
              style={styles.statCard}
            >
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* System Settings */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>System Settings</Text>
          <View style={styles.settingsCard}>
            {SYSTEM_SETTINGS.map((setting, index) => (
              <View
                key={setting.id}
                style={[styles.settingRow, index > 0 && styles.settingRowBorder]}
              >
                <View style={styles.settingIcon}>
                  <Ionicons name={setting.icon as any} size={20} color="#6366F1" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={settings[setting.key]}
                  onValueChange={() => toggleSetting(setting.key)}
                  trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {ADMIN_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.dangerCard}>
            <View style={styles.dangerIcon}>
              <Ionicons name="warning" size={24} color="#EF4444" />
            </View>
            <View style={styles.dangerInfo}>
              <Text style={styles.dangerLabel}>Critical Actions</Text>
              <Text style={styles.dangerDescription}>
                These actions can affect the entire platform
              </Text>
            </View>
          </View>
          <View style={styles.dangerActions}>
            <TouchableOpacity style={styles.dangerButton}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={styles.dangerButtonText}>Clear Cache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerButton}>
              <Ionicons name="refresh-outline" size={18} color="#EF4444" />
              <Text style={styles.dangerButtonText}>Reset Database</Text>
            </TouchableOpacity>
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { width: '48%', padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  section: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  settingsCard: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingRowBorder: { borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  settingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  settingDescription: { fontSize: 13, color: '#6B7280' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  actionDescription: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  dangerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#FEF2F2', borderRadius: 12, marginBottom: 16 },
  dangerIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  dangerInfo: { flex: 1 },
  dangerLabel: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  dangerDescription: { fontSize: 13, color: '#6B7280' },
  dangerActions: { flexDirection: 'row', gap: 12 },
  dangerButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: '#EF4444', borderRadius: 12 },
  dangerButtonText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  bottomSpacing: { height: 20 },
});
