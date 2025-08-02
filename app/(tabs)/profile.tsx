import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    username: user?.username || '',
  });

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
            await signOut();
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await updateProfile(editedProfile);
      if (error) {
        Alert.alert('Error', error);
      } else {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleBecomeCreator = () => {
    Alert.alert(
      'Become a Creator',
      'Would you like to apply to become a creator on SkillBox? You can upload and share your educational content with other learners.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: async () => {
            try {
              const { error } = await updateProfile({ 
                role: 'creator',
                creator_status: 'pending_review' 
              });
              if (error) {
                Alert.alert('Error', error);
              } else {
                Alert.alert(
                  'Application Submitted',
                  'Your creator application has been submitted for review. You will be notified once it is approved.'
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to submit application');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.authPrompt}>
          <ThemedText type="title" style={styles.authTitle}>
            Welcome to SkillBox
          </ThemedText>
          <ThemedText style={styles.authSubtitle}>
            Sign in to access your profile and track your learning progress
          </ThemedText>
          
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.authButtonSecondary}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.authButtonSecondaryText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Profile
          </ThemedText>
        </View>

        <View style={styles.profileSection}>
          {user.profile_image_url ? (
            <Image source={{ uri: user.profile_image_url }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholderAvatar]}>
              <Text style={styles.avatarText}>
                {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {isEditing ? (
            <View style={styles.editForm}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.full_name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, full_name: text })}
                placeholder="Enter your full name"
              />

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.username}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, username: text })}
                placeholder="Enter your username"
              />

              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />

              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditing(false);
                    setEditedProfile({
                      full_name: user.full_name || '',
                      bio: user.bio || '',
                      username: user.username || '',
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <ThemedText type="title" style={styles.profileName}>
                {user.full_name || user.username}
              </ThemedText>
              <Text style={styles.profileEmail}>{user.email}</Text>
              {user.bio && (
                <Text style={styles.profileBio}>{user.bio}</Text>
              )}
              
              <View style={styles.roleSection}>
                <View style={[styles.roleBadge, 
                  user.role === 'creator' && styles.creatorBadge,
                  user.role === 'admin' && styles.adminBadge
                ]}>
                  <Text style={[styles.roleText,
                    user.role === 'creator' && styles.creatorText,
                    user.role === 'admin' && styles.adminText
                  ]}>
                    {user.role === 'learner' ? '🎓 Learner' : 
                     user.role === 'creator' ? '🎨 Creator' : 
                     '👑 Admin'}
                  </Text>
                </View>
                
                {user.role === 'creator' && user.creator_status === 'pending_review' && (
                  <Text style={styles.pendingText}>Application pending review</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          {user.role === 'learner' && user.creator_status === 'not_creator' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBecomeCreator}
            >
              <Text style={styles.actionButtonText}>🎨 Become a Creator</Text>
            </TouchableOpacity>
          )}

          {user.role === 'creator' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/creator')}
            >
              <Text style={styles.actionButtonText}>📊 Creator Dashboard</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/saved-content')}
          >
            <Text style={styles.actionButtonText}>💾 Saved Content</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/demo-requests')}
          >
            <Text style={styles.actionButtonText}>📅 My Demo Requests</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Settings
          </ThemedText>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔔 Notifications</Text>
            <Switch value={true} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🌙 Dark Mode</Text>
            <Switch value={false} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>📱 App Info</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  roleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roleBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  creatorBadge: {
    backgroundColor: '#e3f2fd',
  },
  adminBadge: {
    backgroundColor: '#fff3e0',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  creatorText: {
    color: '#1976d2',
  },
  adminText: {
    color: '#f57c00',
  },
  pendingText: {
    fontSize: 12,
    color: '#ff9800',
    fontStyle: 'italic',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editForm: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionsSection: {
    margin: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingsSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  authButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authButtonSecondary: {
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  authButtonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
