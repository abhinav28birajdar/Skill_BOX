import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { useTheme } from '@/context/EnhancedThemeContext';

const roles = [
  {
    id: 'student',
    title: 'I want to Learn',
    subtitle: 'Student',
    description: 'Discover new skills, take courses, and learn from expert teachers',
    icon: 'school-outline',
    features: [
      'Access thousands of courses',
      'Learn at your own pace',
      'Get certificates',
      'Join live classes',
      'Connect with teachers'
    ],
    gradient: ['#667eea', '#764ba2'],
    color: '#667eea'
  },
  {
    id: 'teacher',
    title: 'I want to Teach',
    subtitle: 'Teacher / Creator',
    description: 'Share your expertise, create courses, and earn from teaching',
    icon: 'person-outline',
    features: [
      'Create unlimited courses',
      'Host live classes',
      'Earn from your skills',
      'Build your brand',
      'Manage students'
    ],
    gradient: ['#f093fb', '#f5576c'],
    color: '#f093fb'
  }
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const scaleValues = {
    student: useSharedValue(1),
    teacher: useSharedValue(1)
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Animate selected card
    Object.keys(scaleValues).forEach(key => {
      if (key === roleId) {
        scaleValues[key as keyof typeof scaleValues].value = withSpring(1.05);
      } else {
        scaleValues[key as keyof typeof scaleValues].value = withSpring(0.95);
      }
    });
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: '/signup',
        params: { role: selectedRole }
      });
    }
  };

  const getAnimatedStyle = (roleId: string) => {
    return useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues[roleId as keyof typeof scaleValues].value }]
    }));
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text 
          className="text-3xl font-bold mb-3"
          style={{ color: colors.text }}
        >
          Choose your role
        </Text>
        <Text 
          className="text-lg"
          style={{ color: colors.textSecondary }}
        >
          How do you want to use SkillBox?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          
          return (
            <Animated.View
              key={role.id}
              style={getAnimatedStyle(role.id)}
              className="mb-6"
            >
              <TouchableOpacity
                onPress={() => handleRoleSelect(role.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? role.gradient as any : [colors.surface, colors.surface]}
                  className="rounded-2xl p-6 border-2"
                  style={{ 
                    borderColor: isSelected ? role.color : colors.border,
                    shadowColor: isSelected ? role.color : colors.cardShadow,
                    shadowOffset: { width: 0, height: isSelected ? 8 : 2 },
                    shadowOpacity: isSelected ? 0.3 : 0.1,
                    shadowRadius: isSelected ? 16 : 8,
                    elevation: isSelected ? 8 : 2,
                  }}
                >
                  {/* Header */}
                  <View className="flex-row items-center mb-4">
                    <View 
                      className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                      style={{ 
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.surfaceAlt 
                      }}
                    >
                      <Ionicons 
                        name={role.icon as any} 
                        size={28} 
                        color={isSelected ? 'white' : role.color} 
                      />
                    </View>
                    
                    <View className="flex-1">
                      <Text 
                        className="text-xl font-bold mb-1"
                        style={{ color: isSelected ? 'white' : colors.text }}
                      >
                        {role.title}
                      </Text>
                      <Text 
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : role.color }}
                      >
                        {role.subtitle}
                      </Text>
                    </View>
                    
                    {isSelected && (
                      <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                        <Ionicons name="checkmark" size={20} color="white" />
                      </View>
                    )}
                  </View>

                  {/* Description */}
                  <Text 
                    className="text-base mb-4 leading-5"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : colors.textSecondary }}
                  >
                    {role.description}
                  </Text>

                  {/* Features */}
                  <View className="space-y-2">
                    {role.features.map((feature, index) => (
                      <View key={index} className="flex-row items-center">
                        <Ionicons 
                          name="checkmark-circle" 
                          size={16} 
                          color={isSelected ? 'white' : role.color}
                          style={{ marginRight: 8 }}
                        />
                        <Text 
                          className="text-sm flex-1"
                          style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textSecondary }}
                        >
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 py-4">
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          fullWidth
          size="lg"
          style={{ 
            opacity: selectedRole ? 1 : 0.5,
            backgroundColor: selectedRole ? colors.primary : colors.textTertiary 
          }}
        />
      </View>
    </SafeAreaView>
  );
}