/**
 * Global Search Page with AI Suggestions
 * Features: Voice search, recent searches, trending topics, filters
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT_SEARCHES = ['React Native', 'UI/UX Design', 'Machine Learning'];
const TRENDING_SEARCHES = ['AI Development', 'Web3', 'Mobile App Design', 'Python Data Science', 'Digital Marketing'];
const POPULAR_INSTRUCTORS = [
  { id: '1', name: 'Sarah Wilson', specialization: 'React Development', avatar: 'https://via.placeholder.com/60/667eea/ffffff?text=SW' },
  { id: '2', name: 'Michael Chen', specialization: 'UI/UX Design', avatar: 'https://via.placeholder.com/60/f093fb/ffffff?text=MC' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, instructors, topics..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setIsVoiceActive(!isVoiceActive)} style={styles.voiceButton}>
            <Ionicons name={isVoiceActive ? 'mic' : 'mic-outline'} size={20} color={isVoiceActive ? '#EF4444' : '#6366F1'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        {RECENT_SEARCHES.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {RECENT_SEARCHES.map((search, index) => (
              <TouchableOpacity key={index} style={styles.searchItem} onPress={() => setSearchQuery(search)}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.searchItemText}>{search}</Text>
                <Ionicons name="arrow-up-outline" size={18} color="#9CA3AF" style={styles.searchItemIcon} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Trending Searches */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <Ionicons name="flame" size={20} color="#EF4444" />
          </View>
          <View style={styles.tagsContainer}>
            {TRENDING_SEARCHES.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag} onPress={() => setSearchQuery(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Popular Instructors */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Instructors</Text>
          {POPULAR_INSTRUCTORS.map((instructor) => (
            <TouchableOpacity key={instructor.id} style={styles.instructorItem} onPress={() => router.push(`/instructors/${instructor.id}`)}>
              <View style={styles.instructorAvatar}>
                <Text style={styles.avatarText}>{instructor.name[0]}</Text>
              </View>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>{instructor.name}</Text>
                <Text style={styles.instructorSpec}>{instructor.specialization}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 4 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  voiceButton: { padding: 4 },
  content: { flex: 1 },
  section: { paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  clearText: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  searchItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  searchItemText: { flex: 1, fontSize: 16, color: '#1F2937' },
  searchItemIcon: { marginLeft: 'auto' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#EEF2FF', borderRadius: 20 },
  tagText: { fontSize: 14, fontWeight: '600', color: '#6366F1' },
  instructorItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  instructorAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  instructorSpec: { fontSize: 14, color: '#6B7280' },
  bottomSpacing: { height: 40 },
});
