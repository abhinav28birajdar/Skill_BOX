import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    View
} from 'react-native';

import { Button } from '@/components/ui/Button.fixed';
import { Card, TouchableCard } from '@/components/ui/Card.enhanced';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text.enhanced';
import { useAuth } from '@/context/AuthContext.enhanced';
import { useTheme } from '@/context/ThemeContext';
import { UserRole } from '@/types/database.enhanced';

interface ProfileMenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightElement,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableCard
      variant="outlined"
      padding="md"
      onPress={onPress}
      style={styles.menuItem}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <IconSymbol name={icon} size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.menuItemText}>
            <Text variant="body1" weight="medium">
              {title}
            </Text>
            {subtitle && (
              <Text variant="caption" color="textSecondary">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.menuItemRight}>
          {rightElement}
          {showChevron && (
            <IconSymbol 
              name="chevron.right" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
          )}
        </View>
      </View>
    </TouchableCard>
  );
};

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();
  const { user, signOut, switchRole, isCreator, isLearner, isAdmin } = useAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notification_settings?.push_notifications ?? true
  );

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleAccountSettings = () => {
    router.push('/profile/settings');
  };

  const handleNotificationSettings = () => {
    router.push('/profile/notifications');
  };

  const handleSecuritySettings = () => {
    router.push('/profile/security');
  };

  const handleHelpSupport = () => {
    router.push('/profile/help');
  };

  const handleAbout = () => {
    router.push('/profile/about');
  };

  const handleSwitchToCreator = async () => {
    Alert.alert(
      'Switch to Creator',
      'You will be able to create and publish content, host live classes, and earn money from your expertise.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            const { error } = await switchRole('creator');
            if (!error) {
              router.push('/(creator)');
            }
          },
        },
      ]
    );
  };

  const handleSwitchToLearner = async () => {
    Alert.alert(
      'Switch to Learner',
      'You will focus on discovering and consuming content, taking courses, and learning new skills.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            const { error } = await switchRole('learner');
            if (!error) {
              router.push('/(tabs)');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (!error) {
              router.replace('/(auth)/sign-in');
            }
          },
        },
      ]
    );
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'creator':
        return 'Creator';
      case 'learner':
        return 'Learner';
      case 'teacher_approved':
        return 'Verified Creator';
      case 'student':
        return 'Student';
      default:
        return role.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'creator':
      case 'teacher_approved':
        return theme.colors.secondary;
      case 'learner':
      case 'student':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" weight="bold">
          Profile
        </Text>
      </View>

      {/* User Profile Card */}
      <Card variant="elevated" padding="lg" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text variant="h4" color="white" weight="bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text variant="h5" weight="semibold">
              {user?.full_name || 'User'}
            </Text>
            <Text variant="body2" color="textSecondary">
              @{user?.username}
            </Text>
            
            <View style={styles.roleBadge}>
              <View style={[styles.roleIndicator, { backgroundColor: getRoleColor(user?.role || 'learner') }]} />
              <Text variant="caption" weight="medium" style={{ color: getRoleColor(user?.role || 'learner') }}>
                {getRoleDisplayName(user?.role || 'learner')}
              </Text>
            </View>
          </View>
          
          <Button variant="outline" size="sm" onPress={handleEditProfile}>
            Edit
          </Button>
        </View>

        {user?.bio && (
          <Text variant="body2" color="textSecondary" style={styles.bio}>
            {user.bio}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text variant="h6" weight="bold">
              {isCreator ? (user?.total_students || 0) : '0'}
            </Text>
            <Text variant="caption" color="textSecondary">
              {isCreator ? 'Students' : 'Courses'}
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text variant="h6" weight="bold">
              {user?.average_rating?.toFixed(1) || 'New'}
            </Text>
            <Text variant="caption" color="textSecondary">
              Rating
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text variant="h6" weight="bold">
              {isCreator ? `$${user?.total_earnings || 0}` : '0'}
            </Text>
            <Text variant="caption" color="textSecondary">
              {isCreator ? 'Earned' : 'Spent'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Role Switch */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Role & Experience
        </Text>
        
        {isLearner && (
          <ProfileMenuItem
            icon="person.crop.circle.badge.plus"
            title="Become a Creator"
            subtitle="Share your knowledge and start earning"
            onPress={handleSwitchToCreator}
          />
        )}
        
        {isCreator && (
          <ProfileMenuItem
            icon="book.fill"
            title="Switch to Learning Mode"
            subtitle="Focus on discovering new content"
            onPress={handleSwitchToLearner}
          />
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Settings
        </Text>
        
        <ProfileMenuItem
          icon="person.circle"
          title="Account Settings"
          subtitle="Update your personal information"
          onPress={handleAccountSettings}
        />
        
        <ProfileMenuItem
          icon="bell.fill"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={handleNotificationSettings}
          showChevron={false}
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          }
        />
        
        <ProfileMenuItem
          icon="lock.fill"
          title="Security & Privacy"
          subtitle="Password, privacy, and data settings"
          onPress={handleSecuritySettings}
        />
        
        <ProfileMenuItem
          icon={isDark ? 'sun.max.fill' : 'moon.fill'}
          title="Dark Mode"
          subtitle={`Currently ${isDark ? 'enabled' : 'disabled'}`}
          onPress={toggleTheme}
          showChevron={false}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          }
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
          Support & Info
        </Text>
        
        <ProfileMenuItem
          icon="questionmark.circle.fill"
          title="Help & Support"
          subtitle="Get help, report issues, contact us"
          onPress={handleHelpSupport}
        />
        
        <ProfileMenuItem
          icon="info.circle.fill"
          title="About SkillBox"
          subtitle="Version 1.0.0"
          onPress={handleAbout}
        />
      </View>

      {/* Creator-specific links */}
      {isCreator && (
        <View style={styles.section}>
          <Text variant="h6" weight="semibold" style={styles.sectionTitle}>
            Creator Tools
          </Text>
          
          <ProfileMenuItem
            icon="chart.bar.fill"
            title="Analytics"
            subtitle="View your performance metrics"
            onPress={() => router.push('/(creator)/analytics')}
          />
          
          <ProfileMenuItem
            icon="dollarsign.circle.fill"
            title="Earnings"
            subtitle="Manage payouts and finances"
            onPress={() => router.push('/(creator)/earnings')}
          />
          
          <ProfileMenuItem
            icon="gear"
            title="Creator Settings"
            subtitle="Manage your creator profile"
            onPress={() => router.push('/(creator)/settings')}
          />
        </View>
      )}

      {/* Sign Out */}
      <View style={styles.section}>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleSignOut}
          leftIcon={
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="white" />
          }
        >
          Sign Out
        </Button>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  profileCard: {
    margin: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  roleIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  bio: {
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stat: {
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
