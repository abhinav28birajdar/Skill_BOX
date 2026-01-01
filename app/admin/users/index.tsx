/**
 * User Management Screen (Admin)
 * Features: User list, roles, actions, search/filter
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const USER_TABS = ['All', 'Students', 'Instructors', 'Admins'];

const USERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'Student', avatar: 'https://i.pravatar.cc/150?img=1', courses: 12, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Mike Chen', email: 'mike.c@email.com', role: 'Instructor', avatar: 'https://i.pravatar.cc/150?img=2', courses: 8, joined: '2023-11-20', status: 'active' },
  { id: 3, name: 'Emma Wilson', email: 'emma.w@email.com', role: 'Student', avatar: 'https://i.pravatar.cc/150?img=3', courses: 5, joined: '2024-02-10', status: 'active' },
  { id: 4, name: 'David Brown', email: 'david.b@email.com', role: 'Instructor', avatar: 'https://i.pravatar.cc/150?img=4', courses: 15, joined: '2023-08-05', status: 'active' },
  { id: 5, name: 'Lisa Garcia', email: 'lisa.g@email.com', role: 'Student', avatar: 'https://i.pravatar.cc/150?img=5', courses: 20, joined: '2023-12-01', status: 'suspended' },
  { id: 6, name: 'James Taylor', email: 'james.t@email.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=6', courses: 0, joined: '2023-01-10', status: 'active' },
];

export default function AdminUsersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = USERS.filter((user) => {
    const matchesTab = selectedTab === 'All' || user.role.toLowerCase() === selectedTab.toLowerCase().slice(0, -1);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Instructor': return { bg: '#DBEAFE', text: '#3B82F6' };
      default: return { bg: '#D1FAE5', text: '#10B981' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {USER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="people" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{USERS.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="person-add" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="warning" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>
              {USERS.filter((u) => u.status === 'suspended').length}
            </Text>
            <Text style={styles.statLabel}>Suspended</Text>
          </Animated.View>
        </View>

        {/* Users List */}
        <View style={styles.usersList}>
          {filteredUsers.map((user, index) => (
            <Animated.View
              key={user.id}
              entering={FadeInDown.delay(250 + index * 100)}
              style={styles.userCard}
            >
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: getRoleColor(user.role).bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        { color: getRoleColor(user.role).text },
                      ]}
                    >
                      {user.role}
                    </Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.userMetaItem}>
                    <Ionicons name="book-outline" size={14} color="#6B7280" />
                    <Text style={styles.userMetaText}>{user.courses} courses</Text>
                  </View>
                  <View style={styles.userMetaDot} />
                  <Text style={styles.userMetaText}>Joined {user.joined}</Text>
                  {user.status === 'suspended' && (
                    <>
                      <View style={styles.userMetaDot} />
                      <View style={styles.suspendedBadge}>
                        <Text style={styles.suspendedText}>Suspended</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
              </TouchableOpacity>
            </Animated.View>
          ))}
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
  searchContainer: { padding: 20, backgroundColor: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabsScroll: { paddingHorizontal: 20 },
  tab: { paddingHorizontal: 20, paddingVertical: 8, marginRight: 12, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  statsGrid: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  usersList: { paddingHorizontal: 20, gap: 12 },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  userAvatar: { width: 56, height: 56, borderRadius: 28 },
  userInfo: { flex: 1 },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  roleText: { fontSize: 10, fontWeight: '800' },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userMetaText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  userMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  suspendedBadge: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#FEE2E2', borderRadius: 6 },
  suspendedText: { fontSize: 10, fontWeight: '700', color: '#EF4444' },
  moreButton: { padding: 8 },
  bottomSpacing: { height: 20 },
});
