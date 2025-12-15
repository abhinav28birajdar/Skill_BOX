import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RoleCard } from '@/components/auth/RoleCard';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

type UserRole = 'student' | 'instructor' | 'creator' | 'organization';

const ROLES = [
  {
    role: 'student' as UserRole,
    title: 'Student',
    description: 'Learn new skills from expert instructors and grow your knowledge',
    icon: 'school' as const,
  },
  {
    role: 'instructor' as UserRole,
    title: 'Instructor',
    description: 'Teach courses, share your expertise, and earn income',
    icon: 'person-circle' as const,
  },
  {
    role: 'creator' as UserRole,
    title: 'Content Creator',
    description: 'Create and sell educational content, templates, and resources',
    icon: 'create' as const,
  },
  {
    role: 'organization' as UserRole,
    title: 'Organization',
    description: 'Manage team learning, training programs, and enterprise solutions',
    icon: 'business' as const,
  },
];
    gradient: ['#f093fb', '#f5576c'],
    color: '#f093fb'

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    // Navigate to signup with the selected role
    router.push({
      pathname: '/signup',
      params: { role: selectedRole },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.header}
        >
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Join SkillBOx</Text>
          <Text style={styles.subtitle}>
            Choose how you want to use SkillBOx
          </Text>
        </Animated.View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {ROLES.map((role, index) => (
            <Animated.View
              key={role.role}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <RoleCard
                role={role.role}
                title={role.title}
                description={role.description}
                icon={role.icon}
                selected={selectedRole === role.role}
                onPress={() => setSelectedRole(role.role)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Info Text */}
        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          style={styles.infoContainer}
        >
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            You can change your role anytime in settings
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      {selectedRole && (
        <Animated.View
          entering={FadeInUp.duration(300).springify()}
          style={styles.buttonContainer}
        >
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  rolesContainer: {
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
});