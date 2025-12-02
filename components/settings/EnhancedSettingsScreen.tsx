import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ApiKeyManager from '@/components/common/ApiKeyManager';
import ModernCard from '@/components/ui/ModernCard';
import { useEnhancedTheme } from '@/hooks/useEnhancedTheme';
import { useAppStore } from '@/store/useAppStore';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  showChevron?: boolean;
  switch?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  };
  onPress?: () => void;
  variant?: 'default' | 'danger';
}

function SettingItem({
  icon,
  title,
  subtitle,
  value,
  showChevron = false,
  switch: switchProps,
  onPress,
  variant = 'default',
}: SettingItemProps) {
  const { colors, spacing, fontSize, fontWeight } = useEnhancedTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !switchProps}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: variant === 'danger' ? colors.error + '20' : colors.primary + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={variant === 'danger' ? colors.error : colors.primary}
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: variant === 'danger' ? colors.error : colors.text,
          marginBottom: subtitle ? 2 : 0,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: fontSize.sm,
            color: colors.textSecondary,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {switchProps && (
        <Switch
          value={switchProps.value}
          onValueChange={switchProps.onValueChange}
          trackColor={{ false: colors.borderSecondary, true: colors.primary + '40' }}
          thumbColor={switchProps.value ? colors.primary : colors.textTertiary}
        />
      )}
      
      {value && (
        <Text style={{
          fontSize: fontSize.sm,
          color: colors.textSecondary,
          marginRight: spacing.sm,
        }}>
          {value}
        </Text>
      )}
      
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textTertiary}
        />
      )}
    </TouchableOpacity>
  );
}

export default function EnhancedSettingsScreen() {
  const { colors, spacing, fontSize, fontWeight } = useEnhancedTheme();
  const {
    theme,
    settings,
    supabase: supabaseConfig,
    setTheme,
    toggleTheme,
    updateSettings,
    reset,
  } = useAppStore();
  
  const [showApiManager, setShowApiManager] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
            onPress: () => {
            reset();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear all settings and data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            Alert.alert('App Reset', 'All settings and data have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <ModernCard style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Account
          </Text>
          
          <SettingItem
            icon="person"
            title="Profile"
            subtitle="Update your personal information"
            onPress={() => router.push('/profile' as any)}
            showChevron
          />
          
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => router.push('/settings/notifications' as any)}
            showChevron
          />
          
          <SettingItem
            icon="shield-checkmark"
            title="Privacy"
            subtitle="Control your privacy settings"
            onPress={() => router.push('/settings/privacy' as any)}
            showChevron
          />
        </ModernCard>

        {/* Appearance Section */}
        <ModernCard style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Appearance
          </Text>
          
          <SettingItem
            icon="color-palette"
            title="Theme"
            value={theme.theme === 'auto' ? 'System' : theme.theme}
            onPress={() => {
              Alert.alert(
                'Select Theme',
                'Choose your preferred theme',
                [
                  { text: 'Light', onPress: () => setTheme('light') },
                  { text: 'Dark', onPress: () => setTheme('dark') },
                  { text: 'System', onPress: () => setTheme('auto') },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
            showChevron
          />
          
          <SettingItem
            icon="accessibility"
            title="Accessibility"
            subtitle="Adjust accessibility settings"
            onPress={() => router.push('/settings/accessibility' as any)}
            showChevron
          />
        </ModernCard>

        {/* Learning Section */}
        <ModernCard style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Learning
          </Text>
          
          <SettingItem
            icon="alarm"
            title="Study Reminders"
            switch={{
              value: settings.learning.reminderEnabled,
              onValueChange: (value) => 
                updateSettings({ learning: { ...settings.learning, reminderEnabled: value } })
            }}
          />
          
          <SettingItem
            icon="play-circle"
            title="Auto-play Videos"
            switch={{
              value: settings.learning.autoPlay,
              onValueChange: (value) => 
                updateSettings({ learning: { ...settings.learning, autoPlay: value } })
            }}
          />
          
          <SettingItem
            icon="speedometer"
            title="Playback Speed"
            value={`${settings.learning.playbackSpeed}x`}
            onPress={() => {
              Alert.alert(
                'Playback Speed',
                'Choose default video playback speed',
                [
                  { text: '0.5x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 0.5 } }) },
                  { text: '0.75x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 0.75 } }) },
                  { text: '1x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 1.0 } }) },
                  { text: '1.25x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 1.25 } }) },
                  { text: '1.5x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 1.5 } }) },
                  { text: '2x', onPress: () => updateSettings({ learning: { ...settings.learning, playbackSpeed: 2.0 } }) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
            showChevron
          />
        </ModernCard>

        {/* Configuration Section */}
        <ModernCard style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Configuration
          </Text>
          
          <SettingItem
            icon="key"
            title="API Configuration"
            subtitle={
              supabaseConfig.isConfigured
                ? 'Connected to your Supabase database'
                : 'Configure your database connection'
            }
            onPress={() => setShowApiManager(true)}
            showChevron
          />
          
          <SettingItem
            icon="download"
            title="Offline Content"
            subtitle="Manage downloaded courses"
            onPress={() => router.push('/settings/offline' as any)}
            showChevron
          />
        </ModernCard>

        {/* Support Section */}
        <ModernCard style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Support
          </Text>
          
          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            onPress={() => router.push('/support' as any)}
            showChevron
          />
          
          <SettingItem
            icon="chatbubble-ellipses"
            title="Contact Support"
            onPress={() => router.push('/support/contact' as any)}
            showChevron
          />
          
          <SettingItem
            icon="star"
            title="Rate App"
            onPress={() => {
              Alert.alert(
                'Rate SkillBox',
                'Love the app? Please rate us on the App Store!',
                [
                  { text: 'Later', style: 'cancel' },
                  { text: 'Rate Now', onPress: () => console.log('Open App Store') },
                ]
              );
            }}
            showChevron
          />
        </ModernCard>

        {/* Danger Zone */}
        <ModernCard variant="outlined" style={{ margin: spacing.md }}>
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.error,
            marginBottom: spacing.md,
          }}>
            Danger Zone
          </Text>
          
          <SettingItem
            icon="refresh"
            title="Reset App"
            subtitle="Clear all settings and data"
            onPress={handleResetApp}
            variant="danger"
            showChevron
          />
          
          <SettingItem
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            variant="danger"
            showChevron
          />
        </ModernCard>

        {/* Footer */}
        <View style={{
          padding: spacing.lg,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: fontSize.xs,
            color: colors.textTertiary,
            textAlign: 'center',
          }}>
            SkillBox v5.0.0{'\n'}
            © 2024 SkillBox. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* API Key Manager Modal */}
      <ApiKeyManager
        visible={showApiManager}
        onClose={() => setShowApiManager(false)}
        onComplete={() => {
          Alert.alert(
            'Configuration Updated',
            'Your API configuration has been saved successfully!',
            [{ text: 'OK' }]
          );
        }}
      />
    </View>
  );
}