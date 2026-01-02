import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { useThemeColors } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
  danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  showChevron = true,
  danger = false
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 px-4 rounded-xl mb-2"
      style={{ backgroundColor: colors.surface }}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: danger ? colors.error + '20' : colors.primary + '20' }}
      >
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={danger ? colors.error : colors.primary} 
        />
      </View>
      
      <View className="flex-1">
        <Text 
          className="text-base font-semibold"
          style={{ color: danger ? colors.error : colors.text }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            className="text-sm mt-1"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent || (showChevron && onPress && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={colors.textTertiary} 
        />
      ))}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, signOut } = useAuth();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out SkillBox - the best learning platform! Download it now.',
        title: 'SkillBox Learning Platform'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text 
          className="text-xl font-bold"
          style={{ color: colors.text }}
        >
          Settings
        </Text>
        
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          {/* Account Section */}
          <Card style={{ marginBottom: 24 }}>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Account
            </Text>
            
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push('/profile/edit')}
            />
            
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="key-outline"
              title="Change Password"
              subtitle="Update your account password"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage billing and subscriptions"
                onPress={() => router.push('/(student)/profile')}
            />
          </Card>

          {/* Notifications Section */}
          <Card style={{ marginBottom: 24 }}>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Notifications
            </Text>
            
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              rightComponent={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={pushNotifications ? colors.primary : colors.textTertiary}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="mail-outline"
              title="Email Notifications"
              subtitle="Get updates via email"
              rightComponent={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={emailNotifications ? colors.primary : colors.textTertiary}
                />
              }
              showChevron={false}
            />
          </Card>

          {/* Preferences Section */}
          <Card style={{ marginBottom: 24 }}>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Preferences
            </Text>
            
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={darkMode ? colors.primary : colors.textTertiary}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle="English"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="download-outline"
              title="Download over WiFi only"
              subtitle="Save your mobile data"
              rightComponent={
                <Switch
                  value={downloadOverWifi}
                  onValueChange={setDownloadOverWifi}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={downloadOverWifi ? colors.primary : colors.textTertiary}
                />
              }
              showChevron={false}
            />
            
            <SettingItem
              icon="play-outline"
              title="Auto-play videos"
              subtitle="Automatically play next video"
              rightComponent={
                <Switch
                  value={autoPlay}
                  onValueChange={setAutoPlay}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={autoPlay ? colors.primary : colors.textTertiary}
                />
              }
              showChevron={false}
            />
          </Card>

          {/* Support Section */}
          <Card style={{ marginBottom: 24 }}>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Support & Legal
            </Text>
            
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              subtitle="Get help with SkillBox"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="chatbubble-ellipses-outline"
              title="Contact Support"
              subtitle="Reach out to our team"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="share-outline"
              title="Share SkillBox"
              subtitle="Tell your friends about us"
              onPress={handleShare}
            />
            
            <SettingItem
              icon="star-outline"
              title="Rate the App"
              subtitle="Leave a review on the App Store"
              onPress={() => Alert.alert('Thank You!', 'We appreciate your feedback!')}
            />
            
            <SettingItem
              icon="document-text-outline"
              title="Terms of Service"
                onPress={() => router.push('/(student)/profile')}
            />
            
            <SettingItem
              icon="shield-outline"
              title="Privacy Policy"
                onPress={() => router.push('/(student)/profile')}
            />
          </Card>

          {/* Danger Zone */}
          <Card style={{ marginBottom: 40 }}>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.error }}
            >
              Danger Zone
            </Text>
            
            <SettingItem
              icon="log-out-outline"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleSignOut}
              danger
            />
            
            <SettingItem
              icon="trash-outline"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              danger
              showChevron={false}
            />
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}