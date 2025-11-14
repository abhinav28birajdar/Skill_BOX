import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useAuth } from '../../src/hooks/useAuth';
import { useThemeColors } from '../../src/theme';

const { width } = Dimensions.get('window');

const achievements = [
  { icon: 'trophy-outline', title: 'Quick Learner', description: 'Completed first course in record time' },
  { icon: 'star-outline', title: 'Top Performer', description: 'Scored 95% average across all courses' },
  { icon: 'rocket-outline', title: 'Course Creator', description: 'Published your first course' }
];

const stats = [
  { label: 'Courses', value: '12', icon: 'book-outline' },
  { label: 'Hours Learned', value: '156', icon: 'time-outline' },
  { label: 'Certificates', value: '8', icon: 'ribbon-outline' },
  { label: 'Skills', value: '24', icon: 'bulb-outline' }
];

export default function ProfileViewScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, profile, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const scrollY = useSharedValue(0);
  const headerHeight = 280;

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2, headerHeight],
      [1, 0.8, 0.3]
    );

    const scale = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0.9]
    );

    return {
      opacity,
      transform: [{ scale }]
    };
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with gradient background */}
      <Animated.View style={[{ height: headerHeight }, headerStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={{ flex: 1, paddingTop: 20 }}
        >
          {/* Header Actions */}
          <View className="flex-row justify-between items-center px-6 mb-8">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={() => router.push('/profile/edit')}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/(student)/explore')}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name="settings-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Info */}
          <View className="items-center px-6">
            <View className="relative mb-4">
              <View 
                className="w-24 h-24 rounded-full border-4 border-white items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <Text className="text-2xl font-bold text-white">
                    {(profile?.name?.[0] || 'U').toUpperCase()}
                    {(profile?.name?.split(' ')[1]?.[0] || '').toUpperCase()}
                  </Text>
                )}
              </View>
              
              <View 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white items-center justify-center"
                style={{ backgroundColor: '#00D4AA' }}
              >
                <View className="w-2 h-2 rounded-full bg-white" />
              </View>
            </View>
            
            <Text className="text-2xl font-bold text-white mb-1">
              {profile?.name || 'User Name'}
            </Text>
            
            <Text className="text-white/80 mb-4 text-center">
              {user?.role === 'teacher' ? '🎓 Educator' : '📚 Student'} • {profile?.bio || 'Learning every day'}
            </Text>
            
            <View className="flex-row space-x-4">
              <View className="items-center">
                <Text className="text-xl font-bold text-white">156</Text>
                <Text className="text-white/80 text-sm">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-white">89</Text>
                <Text className="text-white/80 text-sm">Following</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-white">4.8</Text>
                <Text className="text-white/80 text-sm">Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Content */}
      <ScrollView
        className="flex-1 -mt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Rounded top container */}
        <View 
          className="flex-1 rounded-t-3xl px-6 pt-8"
          style={{ backgroundColor: colors.background }}
        >
          {/* Tab Navigation */}
          <View className="flex-row mb-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'courses', label: 'Courses' },
              { key: 'achievements', label: 'Awards' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 rounded-xl mr-2 ${
                  activeTab === tab.key ? '' : ''
                }`}
                style={{
                  backgroundColor: activeTab === tab.key ? colors.primary : 'transparent'
                }}
              >
                <Text 
                  className="text-center font-semibold"
                  style={{ 
                    color: activeTab === tab.key ? 'white' : colors.textSecondary 
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <View className="space-y-6">
              {/* Stats Grid */}
              <View className="flex-row flex-wrap justify-between">
                {stats.map((stat, index) => (
                  <Card key={index} style={{ width: (width - 60) / 2, marginBottom: 16 }}>
                    <View className="items-center">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: colors.primary + '20' }}
                      >
                        <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
                      </View>
                      <Text 
                        className="text-2xl font-bold mb-1"
                        style={{ color: colors.text }}
                      >
                        {stat.value}
                      </Text>
                      <Text 
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {stat.label}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>

              {/* Skills */}
              <Card>
                <Text 
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Skills & Expertise
                </Text>
                <View className="flex-row flex-wrap">
                  {(profile?.categories || ['JavaScript', 'React', 'Node.js', 'Design']).map((skill: any, index: any) => (
                    <View
                      key={index}
                      className="mr-2 mb-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.primary + '20' }}
                    >
                      <Text 
                        className="text-sm font-medium"
                        style={{ color: colors.primary }}
                      >
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* Recent Activity */}
              <Card>
                <Text 
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Recent Activity
                </Text>
                <View className="space-y-3">
                  {[
                    'Completed "Advanced React Patterns" course',
                    'Earned "JavaScript Expert" certificate',
                    'Started "UI/UX Design Fundamentals"'
                  ].map((activity, index) => (
                    <View key={index} className="flex-row items-center">
                      <View 
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <Text 
                        className="flex-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {activity}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'achievements' && (
            <View className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: colors.warning + '20' }}
                    >
                      <Ionicons name={achievement.icon as any} size={24} color={colors.warning} />
                    </View>
                    <View className="flex-1">
                      <Text 
                        className="text-lg font-semibold mb-1"
                        style={{ color: colors.text }}
                      >
                        {achievement.title}
                      </Text>
                      <Text 
                        className="text-sm"
                        style={{ color: colors.textSecondary }}
                      >
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Sign Out Button */}
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            style={{ marginTop: 32 }}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}