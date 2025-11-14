import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useAuth } from '../../src/hooks/useAuth';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

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
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Avatar uri={profile?.avatar_url || undefined} name={profile?.name || undefined} size={100} />
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#1C1C1E',
              marginTop: 16,
            }}
          >
            {profile?.name}
          </Text>
          {profile?.bio && (
            <Text
              style={{
                fontSize: 16,
                color: '#8E8E93',
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              {profile.bio}
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card variant="outlined" padding={0} style={{ marginBottom: 16 }}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => router.push('/profile/edit')}
            />
            <MenuItem
              icon="book-outline"
              title="My Certificates"
                onPress={() => router.push('/(student)/profile')}
            />
            <MenuItem
              icon="albums-outline"
              title="Showcase"
                onPress={() => router.push('/(student)/profile')}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
                onPress={() => router.push('/(student)/profile')}
            />
            <MenuItem
              icon="settings-outline"
              title="Settings"
                onPress={() => router.push('/(student)/profile')}
              showDivider={false}
            />
          </Card>

          <Card variant="outlined" padding={0} style={{ marginBottom: 16 }}>
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
                onPress={() => router.push('/(student)/profile')}
            />
            <MenuItem
              icon="information-circle-outline"
              title="About"
                onPress={() => router.push('/(student)/profile')}
              showDivider={false}
            />
          </Card>

          <Button
            title="Sign Out"
            variant="danger"
            onPress={handleSignOut}
            fullWidth
            size="lg"
            icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  showDivider?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  showDivider = true,
}) => (
  <>
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Ionicons name={icon} size={24} color="#007AFF" />
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          color: '#1C1C1E',
          marginLeft: 12,
        }}
      >
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </TouchableOpacity>
    {showDivider && (
      <View
        style={{
          height: 1,
          backgroundColor: '#F2F2F7',
          marginLeft: 52,
        }}
      />
    )}
  </>
);
