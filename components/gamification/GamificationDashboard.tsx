import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  streak: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
}

export function GamificationDashboard() {
  const [stats, setStats] = useState<UserStats>({
    level: 12,
    totalPoints: 3450,
    pointsToNextLevel: 550,
    streak: 7,
    coursesCompleted: 5,
    lessonsCompleted: 45,
    quizzesCompleted: 32,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'footsteps-outline',
      points: 50,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'common',
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Complete 10 lessons',
      icon: 'book-outline',
      points: 100,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      rarity: 'common',
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Score 100% on 5 quizzes',
      icon: 'trophy-outline',
      points: 200,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare',
    },
    {
      id: '4',
      title: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: 'flame-outline',
      points: 300,
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      rarity: 'rare',
    },
    {
      id: '5',
      title: 'Course Conqueror',
      description: 'Complete 5 entire courses',
      icon: 'ribbon-outline',
      points: 500,
      unlocked: true,
      progress: 5,
      maxProgress: 5,
      rarity: 'epic',
    },
    {
      id: '6',
      title: 'Learning Legend',
      description: 'Reach level 20',
      icon: 'star-outline',
      points: 1000,
      unlocked: false,
      progress: 12,
      maxProgress: 20,
      rarity: 'legendary',
    },
  ]);

  const rarityColors = {
    common: ['#94A3B8', '#64748B'],
    rare: ['#3B82F6', '#2563EB'],
    epic: ['#A855F7', '#7C3AED'],
    legendary: ['#F59E0B', '#D97706'],
  };

  const levelProgress = ((4000 - stats.pointsToNextLevel) / 4000) * 100;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Level Card */}
      <View className="p-4">
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white text-3xl font-bold">Level {stats.level}</Text>
              <Text className="text-blue-100 text-sm mt-1">
                {stats.pointsToNextLevel} XP to Level {stats.level + 1}
              </Text>
            </View>
            <View className="bg-white/20 rounded-full p-4">
              <Ionicons name="trophy" size={32} color="white" />
            </View>
          </View>
          
          <View className="bg-white/20 rounded-full h-3 overflow-hidden">
            <View
              className="bg-white h-full rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </View>
          
          <Text className="text-white text-center mt-2 font-semibold">
            {stats.totalPoints} Total XP
          </Text>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View className="px-4 pb-4">
        <View className="flex-row flex-wrap -mx-2">
          <View className="w-1/3 px-2 mb-3">
            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 items-center">
              <Ionicons name="flame" size={28} color="#EF4444" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.streak}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Day Streak</Text>
            </View>
          </View>
          
          <View className="w-1/3 px-2 mb-3">
            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 items-center">
              <Ionicons name="school" size={28} color="#3B82F6" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.coursesCompleted}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Courses</Text>
            </View>
          </View>
          
          <View className="w-1/3 px-2 mb-3">
            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 items-center">
              <Ionicons name="book" size={28} color="#10B981" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.lessonsCompleted}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Lessons</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View className="px-4 pb-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements
        </Text>
        
        {achievements.map(achievement => (
          <TouchableOpacity key={achievement.id} className="mb-3">
            <LinearGradient
              colors={achievement.unlocked ? rarityColors[achievement.rarity] : ['#E5E7EB', '#D1D5DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-xl p-4"
            >
              <View className="flex-row items-center">
                <View className={`w-16 h-16 rounded-full items-center justify-center ${
                  achievement.unlocked ? 'bg-white/20' : 'bg-gray-300'
                }`}>
                  <Ionicons
                    name={achievement.icon as any}
                    size={32}
                    color={achievement.unlocked ? 'white' : '#9CA3AF'}
                  />
                </View>
                
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className={`font-bold text-base ${
                      achievement.unlocked ? 'text-white' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </Text>
                    <View className={`px-2 py-1 rounded-full ${
                      achievement.unlocked ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        achievement.unlocked ? 'text-white' : 'text-gray-600'
                      }`}>
                        {achievement.points} XP
                      </Text>
                    </View>
                  </View>
                  
                  <Text className={`text-sm mb-2 ${
                    achievement.unlocked ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </Text>
                  
                  {!achievement.unlocked && (
                    <View>
                      <View className="bg-white/20 rounded-full h-2 overflow-hidden">
                        <View
                          className="bg-white h-full rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </View>
                      <Text className="text-xs text-white/60 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </Text>
                    </View>
                  )}
                  
                  {achievement.unlocked && (
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={16} color="white" />
                      <Text className="text-xs text-white/80 ml-1">Unlocked!</Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Challenges */}
      <View className="px-4 pb-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Daily Challenges
        </Text>
        
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={24} color="#3B82F6" />
              <Text className="ml-2 font-semibold text-gray-900 dark:text-white">
                Complete 3 Lessons
              </Text>
            </View>
            <Text className="text-blue-500 font-bold">+100 XP</Text>
          </View>
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <View className="bg-blue-500 h-full rounded-full" style={{ width: '66%' }} />
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">2/3 completed</Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="rocket-outline" size={24} color="#10B981" />
              <Text className="ml-2 font-semibold text-gray-900 dark:text-white">
                Score 80%+ on a Quiz
              </Text>
            </View>
            <Text className="text-green-500 font-bold">+150 XP</Text>
          </View>
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <View className="bg-green-500 h-full rounded-full" style={{ width: '0%' }} />
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not started</Text>
        </View>
      </View>
    </ScrollView>
  );
}
