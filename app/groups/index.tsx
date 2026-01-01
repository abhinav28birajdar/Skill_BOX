/**
 * Study Groups Page
 * Features: Browse/join groups, group cards with members
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const STUDY_GROUPS = [
  {
    id: 1,
    name: 'React Native Enthusiasts',
    description: 'Building amazing mobile apps together',
    members: 234,
    category: 'Programming',
    isJoined: true,
    image: 'https://picsum.photos/seed/react/400/200',
    activeNow: 12,
  },
  {
    id: 2,
    name: 'UI/UX Design Masters',
    description: 'Learn design principles and best practices',
    members: 189,
    category: 'Design',
    isJoined: true,
    image: 'https://picsum.photos/seed/design/400/200',
    activeNow: 8,
  },
  {
    id: 3,
    name: 'Python for Data Science',
    description: 'Data analysis, ML, and visualization',
    members: 567,
    category: 'Data Science',
    isJoined: false,
    image: 'https://picsum.photos/seed/python/400/200',
    activeNow: 23,
  },
  {
    id: 4,
    name: 'Web3 & Blockchain',
    description: 'Exploring the decentralized future',
    members: 145,
    category: 'Blockchain',
    isJoined: false,
    image: 'https://picsum.photos/seed/web3/400/200',
    activeNow: 5,
  },
];

export default function StudyGroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState(STUDY_GROUPS);
  const [selectedTab, setSelectedTab] = useState<'all' | 'my-groups'>('all');

  const handleToggleJoin = (groupId: number) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, isJoined: !g.isJoined, members: g.isJoined ? g.members - 1 : g.members + 1 }
          : g
      )
    );
  };

  const filteredGroups = selectedTab === 'my-groups' ? groups.filter((g) => g.isJoined) : groups;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Groups</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'my-groups' && styles.tabActive]}
          onPress={() => setSelectedTab('my-groups')}
        >
          <Text style={[styles.tabText, selectedTab === 'my-groups' && styles.tabTextActive]}>
            My Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Groups List */}
        <View style={styles.groupsList}>
          {filteredGroups.map((group, index) => (
            <Animated.View key={group.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity style={styles.groupCard}>
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupContent}>
                  <View style={styles.groupHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{group.category}</Text>
                    </View>
                    {group.isJoined && (
                      <View style={styles.joinedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.joinedText}>Joined</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupDescription}>{group.description}</Text>

                  <View style={styles.groupFooter}>
                    <View style={styles.groupStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="people-outline" size={16} color="#6B7280" />
                        <Text style={styles.statText}>{group.members}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <View style={styles.activeDot} />
                        <Text style={styles.statText}>{group.activeNow} online</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.joinButton, group.isJoined && styles.leaveButton]}
                      onPress={() => handleToggleJoin(group.id)}
                    >
                      <Text
                        style={[styles.joinButtonText, group.isJoined && styles.leaveButtonText]}
                      >
                        {group.isJoined ? 'Leave' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Create Group FAB */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#EEF2FF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#6366F1' },
  content: { flex: 1 },
  groupsList: { padding: 20, gap: 16 },
  groupCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  groupImage: { width: '100%', height: 140 },
  groupContent: { padding: 16 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#EEF2FF', borderRadius: 6 },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#6366F1' },
  joinedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  joinedText: { fontSize: 12, fontWeight: '600', color: '#10B981' },
  groupName: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  groupDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  groupFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupStats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#6B7280' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  joinButton: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#6366F1', borderRadius: 8 },
  joinButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  leaveButton: { backgroundColor: '#F3F4F6' },
  leaveButtonText: { color: '#6B7280' },
  bottomSpacing: { height: 80 },
  fab: { position: 'absolute', bottom: 20, right: 20, borderRadius: 28, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  fabGradient: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
});
