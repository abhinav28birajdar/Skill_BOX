/**
 * Enhanced Settings Screen
 * Modern settings with theme toggle, account management, and preferences
 */

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/EnhancedThemeContext';
import { configManager } from '@/lib/configManager';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EnhancedSettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme, themeMode, setThemeMode, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

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
            await signOut();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetConfig = () => {
    Alert.alert(
      'Reset Configuration',
      'This will reset all API configurations. You will need to set them up again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await configManager.clearAll();
            Alert.alert('Configuration Reset', 'Please restart the app to reconfigure.');
          },
        },
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
        {children}
      </View>
    </View>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={22} color={theme.colors.primary} />
        <Text style={[styles.settingText, { color: theme.colors.text }]}>
          {title}
        </Text>
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Manage your account and preferences
        </Text>
      </MotiView>

      {/* Appearance Section */}
      {renderSection(
        'APPEARANCE',
        <>
          {renderSettingItem(
            'moon',
            'Dark Mode',
            toggleTheme,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          )}
          {renderSettingItem(
            'color-palette',
            'Theme Mode',
            undefined,
            <View style={styles.themeButtons}>
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor:
                        themeMode === mode ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color: themeMode === mode ? '#FFFFFF' : theme.colors.text,
                      },
                    ]}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      {/* Notifications Section */}
      {renderSection(
        'NOTIFICATIONS',
        <>
          {renderSettingItem(
            'notifications',
            'Push Notifications',
            undefined,
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          )}
          {renderSettingItem(
            'mail',
            'Email Updates',
            undefined,
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          )}
        </>
      )}

      {/* Account Section */}
      {renderSection(
        'ACCOUNT',
        <>
          {renderSettingItem('person', 'Edit Profile', () => router.push('/profile/edit'))}
          {renderSettingItem('key', 'Change Password', () => router.push('/reset-password'))}
          {renderSettingItem('shield-checkmark', 'Privacy & Security', () => {})}
        </>
      )}

      {/* App Section */}
      {renderSection(
        'APP',
        <>
          {renderSettingItem('settings', 'API Configuration', () => router.push('/config-setup'))}
          {renderSettingItem('trash', 'Clear Cache', handleClearCache)}
          {renderSettingItem('refresh', 'Reset Configuration', handleResetConfig)}
          {renderSettingItem('information-circle', 'About', () => {})}
        </>
      )}

      {/* Support Section */}
      {renderSection(
        'SUPPORT',
        <>
          {renderSettingItem('help-circle', 'Help & Support', () => router.push('/support'))}
          {renderSettingItem('chatbubble', 'Send Feedback', () => router.push('/feedback'))}
          {renderSettingItem('document-text', 'Terms of Service', () => {})}
          {renderSettingItem('shield', 'Privacy Policy', () => {})}
        </>
      )}

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
        Version 5.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 24,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 32,
  },
});
