/**
 * Privacy Settings Page
 * Features: Profile visibility, data sharing preferences
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [profilePublic, setProfilePublic] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Public Profile</Text>
                <Text style={styles.settingSubtext}>Allow others to view your profile</Text>
              </View>
              <Switch value={profilePublic} onValueChange={setProfilePublic} />
            </View>
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Show Learning Progress</Text>
                <Text style={styles.settingSubtext}>Display course progress on profile</Text>
              </View>
              <Switch value={showProgress} onValueChange={setShowProgress} />
            </View>
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Show Achievements</Text>
                <Text style={styles.settingSubtext}>Display badges and certificates</Text>
              </View>
              <Switch value={showAchievements} onValueChange={setShowAchievements} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Allow Direct Messages</Text>
                <Text style={styles.settingSubtext}>Let other students message you</Text>
              </View>
              <Switch value={allowMessages} onValueChange={setAllowMessages} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Learning Analytics</Text>
                <Text style={styles.settingSubtext}>Help improve recommendations</Text>
              </View>
              <Switch value={dataCollection} onValueChange={setDataCollection} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionIcon}>
                <Ionicons name="download-outline" size={22} color="#6366F1" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Download My Data</Text>
                <Text style={styles.actionSubtext}>Get a copy of your information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionRow, styles.settingRowBorder]}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionLabel, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={styles.actionSubtext}>Permanently delete your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

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
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingRowBorder: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  settingInfo: { flex: 1, marginRight: 16 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  settingSubtext: { fontSize: 13, color: '#6B7280' },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  actionInfo: { flex: 1 },
  actionLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  actionSubtext: { fontSize: 13, color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
