// ===================================================================
// PROFILE SCREEN - ENHANCED VERSION
// ===================================================================

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import {
    Achievement,
    Course,
    User,
    UserProfile,
    UserProgress
} from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');

// ===================================================================
// TYPES
// ===================================================================

interface ProfileStats {
  coursesCompleted: number;
  totalLearningHours: number;
  certificatesEarned: number;
  skillsAcquired: number;
  currentStreak: number;
  totalPoints: number;
}

interface EditProfileData {
  display_name: string;
  bio: string;
  location: string;
  website: string;
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
}

// ===================================================================
// PROFILE SCREEN COMPONENT
// ===================================================================

export default function ProfileScreenEnhanced() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'achievements' | 'activity'>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Data states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    coursesCompleted: 0,
    totalLearningHours: 0,
    certificatesEarned: 0,
    skillsAcquired: 0,
    currentStreak: 0,
    totalPoints: 0,
  });
  
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Edit profile state
  const [editData, setEditData] = useState<EditProfileData>({
    display_name: '',
    bio: '',
    location: '',
    website: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
  });

  // ===================================================================
  // DATA LOADING
  // ===================================================================

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Get current user
      const userResult = await AuthService.getCurrentUser();
      if (!userResult.success || !userResult.data) return;

      const user = userResult.data;
      setCurrentUser(user);

      // Initialize edit data
      setEditData({
        display_name: user.display_name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        linkedin_url: user.linkedin_url || '',
        twitter_url: user.twitter_url || '',
        github_url: user.github_url || '',
      });

      // Load profile data in parallel
      const [
        profileResult,
        progressResult,
        coursesResult,
        achievementsResult,
        activityResult,
      ] = await Promise.all([
        AuthService.getUserProfile(user.id),
        ContentService.getUserProgress(user.id),
        ContentService.getUserCompletedCourses(user.id),
        ContentService.getUserAchievements(user.id),
        ContentService.getUserActivity(user.id),
      ]);

      if (profileResult.success && profileResult.data) {
        setUserProfile(profileResult.data);
      }

      if (progressResult.success && progressResult.data) {
        setUserProgress(progressResult.data);
        
        // Calculate stats
        const progress = progressResult.data;
        const completed = progress.filter(p => p.completion_percentage === 100);
        const totalHours = progress.reduce((sum, p) => sum + (p.time_spent_seconds / 3600), 0);
        const totalPoints = progress.reduce((sum, p) => sum + (p.points_earned || 0), 0);
        
        setProfileStats(prev => ({
          ...prev,
          coursesCompleted: completed.length,
          totalLearningHours: Math.round(totalHours * 10) / 10,
          totalPoints,
          currentStreak: 7, // This would come from streak calculation
        }));
      }

      if (coursesResult.success && coursesResult.data) {
        setCompletedCourses(coursesResult.data);
      }

      if (achievementsResult.success && achievementsResult.data) {
        setUserAchievements(achievementsResult.data);
        setProfileStats(prev => ({
          ...prev,
          certificatesEarned: achievementsResult.data!.filter(a => a.type === 'certificate').length,
          skillsAcquired: achievementsResult.data!.filter(a => a.type === 'skill').length,
        }));
      }

      if (activityResult.success && activityResult.data) {
        setRecentActivity(activityResult.data);
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  // ===================================================================
  // PROFILE HANDLERS
  // ===================================================================

  const handleUpdateProfile = async () => {
    try {
      const result = await AuthService.updateProfile(editData);
      
      if (result.success) {
        setShowEditModal(false);
        await loadProfileData();
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await AuthService.signOut();
            router.replace('/signin');
          },
        },
      ]
    );
  };

  // ===================================================================
  // RENDER FUNCTIONS
  // ===================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <View style={[styles.profileImage, { backgroundColor: theme.colors.primary + '20' }]}>
          {currentUser?.avatar_url ? (
            <Image source={{ uri: currentUser.avatar_url }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
              {currentUser?.display_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            {currentUser?.display_name || 'User'}
          </Text>
          <Text style={[styles.profileTitle, { color: theme.colors.textSecondary }]}>
            {currentUser?.role === 'creator' ? 'Content Creator' : 'Learner'}
          </Text>
          {currentUser?.bio && (
            <Text style={[styles.profileBio, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {currentUser.bio}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="create" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowSettingsModal(true)}
        >
          <Ionicons name="settings" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {profileStats.coursesCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Courses Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.success }]}>
            {profileStats.totalLearningHours}h
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Learning Hours
          </Text>
        </View>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
            {profileStats.certificatesEarned}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Certificates
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
            {profileStats.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
      {[
        { key: 'overview', label: 'Overview', icon: 'grid' },
        { key: 'courses', label: 'Courses', icon: 'school' },
        { key: 'achievements', label: 'Badges', icon: 'trophy' },
        { key: 'activity', label: 'Activity', icon: 'pulse' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key
                ? theme.colors.primary
                : 'transparent',
            }
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? 'white' : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === tab.key ? 'white' : theme.colors.textSecondary,
              }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <ScrollView
      style={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={() => router.push('/courses')}
          >
            <Ionicons name="book" size={24} color={theme.colors.primary} />
            <Text style={[styles.quickActionText, { color: theme.colors.primary }]}>
              Browse Courses
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.success + '20' }]}
            onPress={() => router.push('/learning')}
          >
            <Ionicons name="play-circle" size={24} color={theme.colors.success} />
            <Text style={[styles.quickActionText, { color: theme.colors.success }]}>
              Continue Learning
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.warning + '20' }]}
            onPress={() => router.push('/community')}
          >
            <Ionicons name="people" size={24} color={theme.colors.warning} />
            <Text style={[styles.quickActionText, { color: theme.colors.warning }]}>
              Join Community
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.colors.secondary + '20' }]}
            onPress={() => router.push('/creator')}
          >
            <Ionicons name="create" size={24} color={theme.colors.secondary} />
            <Text style={[styles.quickActionText, { color: theme.colors.secondary }]}>
              Create Content
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Achievements */}
      {userAchievements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Achievements
            </Text>
            <TouchableOpacity onPress={() => setActiveTab('achievements')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userAchievements.slice(0, 5).map((achievement) => (
              <View
                key={achievement.id}
                style={[styles.achievementCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={[styles.achievementIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                  <Ionicons name="trophy" size={24} color={theme.colors.warning} />
                </View>
                <Text style={[styles.achievementTitle, { color: theme.colors.text }]} numberOfLines={2}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDate, { color: theme.colors.textSecondary }]}>
                  {achievement.unlocked_at && new Date(achievement.unlocked_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Learning Progress */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Learning Progress
        </Text>
        <View style={[styles.progressOverview, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
              Overall Progress
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: '75%', // This would be calculated from actual data
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              75% Average Completion
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderCourses = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {completedCourses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={[styles.courseItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.push(`/courses/${course.id}`)}
        >
          <View style={[styles.courseThumbnail, { backgroundColor: theme.colors.background }]}>
            <Ionicons name="school" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.courseDetails}>
            <Text style={[styles.courseTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={[styles.courseInstructor, { color: theme.colors.textSecondary }]}>
              by {course.instructor?.display_name || 'SkillBox'}
            </Text>
            <View style={styles.courseMeta}>
              <View style={[styles.completedBadge, { backgroundColor: theme.colors.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={[styles.completedText, { color: theme.colors.success }]}>
                  Completed
                </Text>
              </View>
              <Text style={[styles.courseDate, { color: theme.colors.textSecondary }]}>
                Completed {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.achievementsList}>
        {userAchievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[styles.achievementListItem, { backgroundColor: theme.colors.surface }]}
          >
            <View style={[styles.achievementListIcon, { backgroundColor: theme.colors.warning + '20' }]}>
              <Ionicons name="trophy" size={24} color={theme.colors.warning} />
            </View>
            <View style={styles.achievementListDetails}>
              <Text style={[styles.achievementListTitle, { color: theme.colors.text }]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementListDescription, { color: theme.colors.textSecondary }]}>
                {achievement.description}
              </Text>
              {achievement.unlocked_at && (
                <Text style={[styles.achievementListDate, { color: theme.colors.primary }]}>
                  Earned {new Date(achievement.unlocked_at).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderActivity = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.activityList}>
        {recentActivity.map((activity, index) => (
          <View
            key={index}
            style={[styles.activityItem, { backgroundColor: theme.colors.surface }]}
          >
            <View style={[styles.activityIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.activityDetails}>
              <Text style={[styles.activityText, { color: theme.colors.text }]}>
                Completed lesson: React Native Fundamentals
              </Text>
              <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
                2 hours ago
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditModal(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Edit Profile
          </Text>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={[styles.modalSaveButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.modalSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Display Name
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={editData.display_name}
              onChangeText={(text) => setEditData(prev => ({ ...prev, display_name: text }))}
              placeholder="Enter your display name"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Bio
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={editData.bio}
              onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Location
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={editData.location}
              onChangeText={(text) => setEditData(prev => ({ ...prev, location: text }))}
              placeholder="Your location"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Website
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={editData.website}
              onChangeText={(text) => setEditData(prev => ({ ...prev, website: text }))}
              placeholder="https://your-website.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
            <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>
              Done
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: theme.colors.text }]}>
              Appearance
            </Text>
            <TouchableOpacity
              style={[styles.settingsItem, { backgroundColor: theme.colors.surface }]}
              onPress={toggleTheme}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={[styles.settingsSectionTitle, { color: theme.colors.text }]}>
              Account
            </Text>
            <TouchableOpacity
              style={[styles.settingsItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/notifications')}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.settingsItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/support')}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingsItemText, { color: theme.colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.settingsItem, { backgroundColor: theme.colors.surface }]}
              onPress={handleSignOut}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="log-out" size={20} color={theme.colors.error} />
                <Text style={[styles.settingsItemText, { color: theme.colors.error }]}>
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'achievements':
        return renderAchievements();
      case 'activity':
        return renderActivity();
      default:
        return renderOverview();
    }
  };

  // ===================================================================
  // MAIN RENDER
  // ===================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {renderStats()}
      {renderTabs()}
      {renderContent()}
      {renderEditModal()}
      {renderSettingsModal()}
    </SafeAreaView>
  );
}

// ===================================================================
// STYLES
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (screenWidth - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementCard: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  achievementDate: {
    fontSize: 10,
    textAlign: 'center',
  },
  progressOverview: {
    padding: 16,
    borderRadius: 12,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseItem: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseDetails: {
    flex: 1,
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  courseInstructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  courseDate: {
    fontSize: 12,
  },
  achievementsList: {
    paddingHorizontal: 20,
  },
  achievementListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  achievementListIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementListDetails: {
    flex: 1,
  },
  achievementListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementListDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  achievementListDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancelText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingVertical: 12,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});
