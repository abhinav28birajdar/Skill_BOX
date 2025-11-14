import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { useAuth } from '../../src/hooks/useAuth';
import { useThemeColors } from '../../src/theme';

const { width } = Dimensions.get('window');

const featuredCourses = [
  {
    id: 1,
    title: 'React Native Development',
    instructor: 'John Smith',
    rating: 4.8,
    duration: '12 hours',
    price: '$89',
    image: 'https://via.placeholder.com/300x180',
    progress: 0,
    category: 'Programming'
  },
  {
    id: 2,
    title: 'UI/UX Design Mastery',
    instructor: 'Sarah Wilson',
    rating: 4.9,
    duration: '8 hours',
    price: '$79',
    image: 'https://via.placeholder.com/300x180',
    progress: 0,
    category: 'Design'
  }
];

const myCourses = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    instructor: 'Mike Johnson',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    image: 'https://via.placeholder.com/300x180'
  },
  {
    id: 2,
    title: 'Photoshop for Beginners',
    instructor: 'Emma Davis',
    progress: 40,
    totalLessons: 16,
    completedLessons: 6,
    image: 'https://via.placeholder.com/300x180'
  }
];

const categories = [
  { icon: 'laptop-outline', name: 'Programming', count: 120 },
  { icon: 'brush-outline', name: 'Design', count: 89 },
  { icon: 'business-outline', name: 'Business', count: 67 },
  { icon: 'camera-outline', name: 'Photography', count: 45 },
  { icon: 'musical-notes-outline', name: 'Music', count: 34 },
  { icon: 'fitness-outline', name: 'Health', count: 28 }
];

export default function StudentDashboard() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useAuth();
  
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value
  }));

  const renderCourseCard = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() => router.push('/(student)/explore')}
      className="mr-4"
      style={{ width: width * 0.7 }}
    >
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Image 
          source={{ uri: item.image }}
          className="w-full h-32"
          style={{ backgroundColor: colors.border }}
        />
        <View className="p-4">
          <Text 
            className="text-lg font-bold mb-2"
            style={{ color: colors.text }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text 
            className="text-sm mb-2"
            style={{ color: colors.textSecondary }}
          >
            by {item.instructor}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text 
                className="text-sm ml-1 mr-3"
                style={{ color: colors.textSecondary }}
              >
                {item.rating}
              </Text>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text 
                className="text-sm ml-1"
                style={{ color: colors.textSecondary }}
              >
                {item.duration}
              </Text>
            </View>
            <Text 
              className="text-lg font-bold"
              style={{ color: colors.primary }}
            >
              {item.price}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderMyCourseCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push('/(student)/my-courses')}
      className="mb-4"
    >
      <Card>
        <View className="flex-row">
          <Image 
            source={{ uri: item.image }}
            className="w-20 h-20 rounded-lg mr-4"
            style={{ backgroundColor: colors.border }}
          />
          <View className="flex-1">
            <Text 
              className="text-lg font-semibold mb-1"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text 
              className="text-sm mb-2"
              style={{ color: colors.textSecondary }}
            >
              {item.instructor}
            </Text>
            <View className="flex-row items-center mb-2">
              <View 
                className="flex-1 h-2 rounded-full mr-2"
                style={{ backgroundColor: colors.border }}
              >
                <View 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${item.progress}%`,
                    backgroundColor: colors.primary 
                  }}
                />
              </View>
              <Text 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                {item.progress}%
              </Text>
            </View>
            <Text 
              className="text-xs"
              style={{ color: colors.textTertiary }}
            >
              {item.completedLessons} of {item.totalLessons} lessons
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={{ paddingBottom: 20 }}
      >
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white/80 text-base">Good morning,</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.email?.split('@')[0] || 'Student'}! 👋
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={() => router.push('/(student)/profile')}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name="notifications-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/(student)/profile')}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Text className="text-white font-bold">
                  {(user?.email?.[0] || 'S').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => router.push('/(student)/explore')}
            className="flex-row items-center p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
            <Text 
              className="ml-3 flex-1"
              style={{ color: colors.textSecondary }}
            >
              Search courses, instructors...
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 -mt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          <View 
            className="rounded-t-3xl px-6 pt-8"
            style={{ backgroundColor: colors.background }}
          >
            {/* Quick Stats */}
            <View className="flex-row mb-8">
              <Card style={{ flex: 1, marginRight: 8 }}>
                <View className="items-center">
                  <Text 
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    12
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Courses
                  </Text>
                </View>
              </Card>
              
              <Card style={{ flex: 1, marginHorizontal: 4 }}>
                <View className="items-center">
                  <Text 
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    156h
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Learning
                  </Text>
                </View>
              </Card>
              
              <Card style={{ flex: 1, marginLeft: 8 }}>
                <View className="items-center">
                  <Text 
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    8
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Certificates
                  </Text>
                </View>
              </Card>
            </View>

            {/* Continue Learning */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text 
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Continue Learning
                </Text>
                <TouchableOpacity onPress={() => router.push('/(student)/my-courses')}>
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: colors.primary }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={myCourses}
                renderItem={renderMyCourseCard}
                scrollEnabled={false}
              />
            </View>

            {/* Categories */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text 
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Categories
                </Text>
                <TouchableOpacity onPress={() => router.push('/(student)/explore')}>
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: colors.primary }}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row flex-wrap justify-between">
                {categories.slice(0, 6).map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => router.push('/(student)/explore')}
                    className="w-[30%] mb-4"
                  >
                    <Card>
                      <View className="items-center">
                        <View 
                          className="w-12 h-12 rounded-full items-center justify-center mb-2"
                          style={{ backgroundColor: colors.primary + '20' }}
                        >
                          <Ionicons 
                            name={category.icon as any} 
                            size={24} 
                            color={colors.primary} 
                          />
                        </View>
                        <Text 
                          className="text-sm font-semibold text-center"
                          style={{ color: colors.text }}
                          numberOfLines={1}
                        >
                          {category.name}
                        </Text>
                        <Text 
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {category.count} courses
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Featured Courses */}
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text 
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Featured Courses
                </Text>
                <TouchableOpacity onPress={() => router.push('/(student)/explore')}>
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: colors.primary }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={featuredCourses}
                renderItem={renderCourseCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 24 }}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}