import { useTheme } from '@/context/EnhancedThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to SkillBox',
    subtitle: 'Your journey to mastery starts here',
    description: 'Discover thousands of courses taught by expert instructors from around the world',
    icon: '🎓',
    gradient: ['#667eea', '#764ba2']
  },
  {
    id: 2,
    title: 'Learn from Experts',
    subtitle: 'World-class instructors await',
    description: 'Connect with professional teachers and industry experts who share their real-world experience',
    icon: '👨‍🏫',
    gradient: ['#f093fb', '#f5576c']
  },
  {
    id: 3,
    title: 'Learn at Your Pace',
    subtitle: 'Flexible learning experience',
    description: 'Study anytime, anywhere with offline downloads and progress tracking across devices',
    icon: '⚡',
    gradient: ['#4facfe', '#00f2fe']
  },
  {
    id: 4,
    title: 'Join the Community',
    subtitle: 'Connect and grow together',
    description: 'Engage with fellow learners, share your progress, and get support from our global community',
    icon: '🤝',
    gradient: ['#43e97b', '#38f9d7']
  }
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const animationValue = useSharedValue(0);

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    animationValue.value = contentOffset.x / SCREEN_WIDTH;
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true
      });
      setCurrentIndex(nextIndex);
    } else {
      router.replace('/role-selection');
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * SCREEN_WIDTH,
        animated: true
      });
      setCurrentIndex(prevIndex);
    }
  };

  const skip = () => {
    router.replace('/role-selection');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      
      {/* Quick Demo Access */}
      <View className="absolute top-12 left-0 right-0 z-10 px-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)')}
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Quick Demo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={skip}
            className="px-4 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Text className="text-white font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {onboardingData.map((item, index) => (
          <LinearGradient
            key={item.id}
            colors={item.gradient as any}
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 justify-center items-center px-8"
          >
            <View className="items-center">
              <Text className="text-8xl mb-8">{item.icon}</Text>
              
              <Text className="text-4xl font-bold text-white text-center mb-4">
                {item.title}
              </Text>
              
              <Text className="text-xl font-semibold text-white/90 text-center mb-6">
                {item.subtitle}
              </Text>
              
              <Text className="text-lg text-white/80 text-center leading-6 mb-12">
                {item.description}
              </Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Navigation Controls */}
      <View className="absolute bottom-8 left-0 right-0 px-6">
        {/* Pagination Indicators */}
        <View className="flex-row justify-center mb-8">
          {onboardingData.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const opacity = interpolate(
                animationValue.value,
                [index - 1, index, index + 1],
                [0.3, 1, 0.3],
                'clamp'
              );
              const scale = interpolate(
                animationValue.value,
                [index - 1, index, index + 1],
                [0.8, 1.2, 0.8],
                'clamp'
              );
              return {
                opacity,
                transform: [{ scale }],
              };
            });

            return (
              <Animated.View
                key={index}
                style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'white',
                    marginHorizontal: 4,
                  },
                  animatedDotStyle
                ]}
              />
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between items-center">
          {currentIndex > 0 ? (
            <TouchableOpacity 
              onPress={goToPrevious}
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <View className="w-12 h-12" />
          )}

          <Button
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={goToNext}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 32,
              paddingVertical: 14,
            }}
            variant="ghost"
            icon={currentIndex < onboardingData.length - 1 ? 
              <Ionicons name="chevron-forward" size={20} color={colors.primary} /> : 
              undefined
            }
          />
        </View>

        {/* Demo Mode Buttons - Show on last slide */}
        {currentIndex === onboardingData.length - 1 && (
          <View className="mt-6 space-y-3">
            <Text className="text-white text-center text-sm mb-2 opacity-80">
              Or try the app without signing up:
            </Text>
            
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="py-4 px-6 rounded-full items-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="school" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Demo as Student 🎓
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="py-4 px-6 rounded-full items-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="create" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Demo as Creator 👨‍🏫
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}