import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { useAuth } from '../../src/hooks/useAuth';
import { useThemeColors } from '../../src/theme';

const skills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Design',
  'Marketing', 'Photography', 'Writing', 'Music', 'Business'
];

const interests = [
  'Technology', 'Art & Design', 'Business', 'Health & Fitness',
  'Music', 'Photography', 'Travel', 'Cooking', 'Sports', 'Reading'
];

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useAuth();
  
  // Form state
  const [firstName, setFirstName] = useState(profile?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.name?.split(' ')[1] || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.categories || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || []);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const profileScale = useSharedValue(1);
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in your name');
      return;
    }

    profileScale.value = withSpring(0.95, {}, () => {
      profileScale.value = withSpring(1);
    });

    setLoading(true);
    
    const profileData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim(),
      skills: selectedSkills,
      interests: selectedInterests
    };

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 2000);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: profileScale.value }]
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{ flex: 1 }}
      >
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
            Edit Profile
          </Text>
          
          <TouchableOpacity onPress={handleSave}>
            <Text 
              className="text-lg font-semibold"
              style={{ color: colors.primary }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={animatedStyle}>
            {/* Profile Photo */}
            <View className="items-center mb-8">
              <View 
                className="relative"
              >
                <View 
                  className="w-32 h-32 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      className="w-32 h-32 rounded-full"
                    />
                  ) : (
                    <Text 
                      className="text-4xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {(firstName[0] || 'U').toUpperCase()}
                      {(lastName[0] || '').toUpperCase()}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity 
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Ionicons name="camera-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
              
              <Text 
                className="text-sm mt-4"
                style={{ color: colors.textSecondary }}
              >
                Tap to change profile photo
              </Text>
            </View>

            {/* Basic Info */}
            <Card style={{ marginBottom: 24 }}>
              <Text 
                className="text-lg font-bold mb-4"
                style={{ color: colors.text }}
              >
                Basic Information
              </Text>
              
              <View className="space-y-4">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={setFirstName}
                  icon="person-outline"
                />
                
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={setLastName}
                  icon="person-outline"
                />
                
                <View>
                  <Text 
                    className="text-sm font-semibold mb-2"
                    style={{ color: colors.text }}
                  >
                    Bio
                  </Text>
                  <Input
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }}
                    icon="document-text-outline"
                  />
                </View>
              </View>
            </Card>

            {/* Skills Section */}
            <Card style={{ marginBottom: 24 }}>
              <Text 
                className="text-lg font-bold mb-4"
                style={{ color: colors.text }}
              >
                Skills ({selectedSkills.length})
              </Text>
              
              <View className="flex-row flex-wrap">
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <TouchableOpacity
                      key={skill}
                      onPress={() => toggleSkill(skill)}
                      className="mr-2 mb-3 px-4 py-2 rounded-full border"
                      style={{
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                        borderColor: isSelected ? colors.primary : colors.border
                      }}
                    >
                      <Text 
                        className="text-sm font-medium"
                        style={{ 
                          color: isSelected ? 'white' : colors.textSecondary 
                        }}
                      >
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* Interests Section */}
            <Card style={{ marginBottom: 24 }}>
              <Text 
                className="text-lg font-bold mb-4"
                style={{ color: colors.text }}
              >
                Interests ({selectedInterests.length})
              </Text>
              
              <View className="flex-row flex-wrap">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      onPress={() => toggleInterest(interest)}
                      className="mr-2 mb-3 px-4 py-2 rounded-full border"
                      style={{
                        backgroundColor: isSelected ? colors.secondary : 'transparent',
                        borderColor: isSelected ? colors.secondary : colors.border
                      }}
                    >
                      <Text 
                        className="text-sm font-medium"
                        style={{ 
                          color: isSelected ? 'white' : colors.textSecondary 
                        }}
                      >
                        {interest}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* Save Button */}
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              fullWidth
              size="lg"
              style={{ marginBottom: 40 }}
            />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}