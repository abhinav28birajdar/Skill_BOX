import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  category: string;
  tags: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  category: string;
  isJoined: boolean;
  lastActivity: string;
}

export function SocialLearningHub() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'leaderboard'>('feed');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'Sarah Chen', avatar: '👩‍💻', level: 15 },
      content: 'Just completed the React Native course! The AR/VR module was mind-blowing 🚀 Anyone else working on mobile development?',
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: 8,
      isLiked: false,
      category: 'Development',
      tags: ['react-native', 'mobile', 'ar-vr'],
    },
    {
      id: '2',
      author: { name: 'Alex Kumar', avatar: '👨‍🎨', level: 12 },
      content: 'Top 3 tips for mastering UI/UX design:\n1. Study real user behavior\n2. Keep it simple\n3. Test, test, test!\n\nWhat are your favorite design resources?',
      timestamp: new Date(Date.now() - 7200000),
      likes: 42,
      comments: 15,
      isLiked: true,
      category: 'Design',
      tags: ['ui-ux', 'design', 'tips'],
    },
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    { id: '1', name: 'JavaScript Masterclass', members: 156, category: 'Development', isJoined: true, lastActivity: '2h ago' },
    { id: '2', name: 'UI/UX Design Circle', members: 89, category: 'Design', isJoined: true, lastActivity: '5h ago' },
    { id: '3', name: 'Data Science Enthusiasts', members: 203, category: 'Data Science', isJoined: false, lastActivity: '1h ago' },
    { id: '4', name: 'Business Strategy Group', members: 67, category: 'Business', isJoined: false, lastActivity: '3h ago' },
  ]);

  const leaderboard = [
    { rank: 1, name: 'Emma Wilson', avatar: '👩‍🚀', points: 8950, streak: 42 },
    { rank: 2, name: 'David Park', avatar: '👨‍💼', points: 8720, streak: 38 },
    { rank: 3, name: 'Lisa Chen', avatar: '👩‍🔬', points: 8450, streak: 35 },
    { rank: 4, name: 'You', avatar: '🎯', points: 7250, streak: 28 },
    { rank: 5, name: 'James Miller', avatar: '👨‍🎓', points: 6890, streak: 24 },
  ];

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const toggleJoinGroup = (groupId: string) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
          : group
      )
    );
  };

  const renderFeed = () => (
    <ScrollView className="flex-1 p-4">
      {/* Create Post */}
      <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
            <Text className="text-xl">🎯</Text>
          </View>
          <TextInput
            placeholder="Share your learning journey..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 dark:text-white"
          />
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row space-x-2">
            <TouchableOpacity className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <Ionicons name="image-outline" size={18} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-600 dark:text-gray-400">Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <Ionicons name="pricetag-outline" size={18} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-600 dark:text-gray-400">Tag</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-blue-500 rounded-lg px-4 py-2">
            <Text className="text-white text-sm font-semibold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts */}
      {posts.map(post => (
        <View key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          {/* Author Info */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-2xl">{post.author.avatar}</Text>
              </View>
              <View className="ml-3">
                <View className="flex-row items-center">
                  <Text className="font-bold text-gray-900 dark:text-white">{post.author.name}</Text>
                  <View className="ml-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-0.5">
                    <Text className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Lv {post.author.level}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {post.timestamp.toLocaleDateString()} • {post.category}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</Text>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-3">
            {post.tags.map((tag, index) => (
              <View key={index} className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-xs text-gray-600 dark:text-gray-400">#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View className="flex-row items-center justify-around border-t border-gray-100 dark:border-gray-700 pt-3">
            <TouchableOpacity
              onPress={() => toggleLike(post.id)}
              className="flex-row items-center"
            >
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={post.isLiked ? '#EF4444' : '#6B7280'}
              />
              <Text className={`ml-1 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                {post.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
              <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="share-social-outline" size={22} color="#6B7280" />
              <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderGroups = () => (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Study Groups</Text>
      
      {studyGroups.map(group => (
        <View key={group.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-bold text-gray-900 dark:text-white text-lg">{group.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {group.members} members
                </Text>
                <Text className="mx-2 text-gray-400">•</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">{group.lastActivity}</Text>
              </View>
              <View className="mt-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 self-start">
                <Text className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {group.category}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => toggleJoinGroup(group.id)}
              className={`px-4 py-2 rounded-lg ${
                group.isJoined ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-500'
              }`}
            >
              <Text
                className={`font-semibold ${
                  group.isJoined ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                }`}
              >
                {group.isJoined ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Leaderboard</Text>
      
      {leaderboard.map(user => (
        <View
          key={user.rank}
          className={`rounded-xl p-4 mb-3 ${
            user.name === 'You'
              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
              : 'bg-white dark:bg-gray-800'
          }`}
        >
          <View className="flex-row items-center">
            {/* Rank */}
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                user.rank === 1
                  ? 'bg-yellow-500'
                  : user.rank === 2
                  ? 'bg-gray-400'
                  : user.rank === 3
                  ? 'bg-orange-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <Text className="text-white font-bold text-lg">{user.rank}</Text>
            </View>

            {/* Avatar */}
            <View className="w-12 h-12 ml-3 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-2xl">{user.avatar}</Text>
            </View>

            {/* Info */}
            <View className="flex-1 ml-3">
              <Text className="font-bold text-gray-900 dark:text-white">{user.name}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="flame" size={14} color="#EF4444" />
                <Text className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                  {user.streak} day streak
                </Text>
              </View>
            </View>

            {/* Points */}
            <View className="items-end">
              <Text className="font-bold text-lg text-blue-500">{user.points}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">XP</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-12 pb-4 px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Learning Community
        </Text>
        
        {/* Tabs */}
        <View className="flex-row space-x-2">
          {[
            { id: 'feed', icon: 'home-outline', label: 'Feed' },
            { id: 'groups', icon: 'people-outline', label: 'Groups' },
            { id: 'leaderboard', icon: 'trophy-outline', label: 'Leaderboard' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.id ? 'white' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-semibold ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {activeTab === 'feed' && renderFeed()}
      {activeTab === 'groups' && renderGroups()}
      {activeTab === 'leaderboard' && renderLeaderboard()}
    </View>
  );
}
