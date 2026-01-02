import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/hooks/useAuth';
import { useThemeColors } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const courseData = {
  id: 1,
  title: 'React Native Development Masterclass',
  instructor: {
    name: 'John Smith',
    avatar: 'https://via.placeholder.com/100x100',
    rating: 4.9,
    students: 15420,
    courses: 12
  },
  description: 'Learn to build beautiful, cross-platform mobile applications with React Native. This comprehensive course covers everything from basics to advanced topics including navigation, state management, and deployment.',
  price: 89,
  originalPrice: 199,
  discount: 55,
  rating: 4.8,
  reviews: 2341,
  students: 18950,
  duration: '12 hours',
  totalLessons: 68,
  level: 'Intermediate',
  language: 'English',
  lastUpdated: '2024-01-15',
  image: 'https://via.placeholder.com/400x240',
  previewVideo: 'https://via.placeholder.com/400x240',
  enrolled: false,
  progress: 0,
  certificate: true,
  downloadable: true,
  features: [
    'Lifetime access',
    '68 video lessons',
    'Downloadable resources',
    'Certificate of completion',
    'Mobile and TV access',
    'Community support'
  ],
  curriculum: [
    {
      id: 1,
      title: 'Getting Started',
      lessons: [
        { id: 1, title: 'Introduction to React Native', duration: '15:30', preview: true },
        { id: 2, title: 'Setting up Development Environment', duration: '22:45', preview: false },
        { id: 3, title: 'Creating Your First App', duration: '18:20', preview: false }
      ]
    },
    {
      id: 2,
      title: 'Core Components',
      lessons: [
        { id: 4, title: 'Views and Text Components', duration: '20:15', preview: false },
        { id: 5, title: 'Images and ScrollViews', duration: '16:40', preview: false },
        { id: 6, title: 'Buttons and Input Elements', duration: '19:30', preview: false }
      ]
    },
    {
      id: 3,
      title: 'Navigation and Routing',
      lessons: [
        { id: 7, title: 'Stack Navigation', duration: '24:10', preview: false },
        { id: 8, title: 'Tab Navigation', duration: '18:55', preview: false },
        { id: 9, title: 'Drawer Navigation', duration: '21:30', preview: false }
      ]
    }
  ],
  reviewsData: [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/50x50',
      rating: 5,
      date: '2024-01-10',
      comment: 'Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.'
    },
    {
      id: 2,
      user: 'Mike Davis',
      avatar: 'https://via.placeholder.com/50x50',
      rating: 5,
      date: '2024-01-08',
      comment: 'Best React Native course I have taken. Highly recommended for anyone wanting to learn mobile development.'
    }
  ]
};

export default function CourseDetailScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const scrollY = useSharedValue(0);
  const headerHeight = 250;
  const buttonScale = useSharedValue(1);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2, headerHeight],
      [1, 0.5, 0]
    );

    return { opacity };
  });

  const handleEnroll = () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    Alert.alert(
      'Enroll in Course',
      `Do you want to enroll in "${courseData.title}" for $${courseData.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enroll Now', 
          onPress: () => {
            Alert.alert('Success!', 'You have successfully enrolled in the course.');
            // Course enrolled - could navigate to lessons
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing course: ${courseData.title} on SkillBox!`,
        title: courseData.title
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    Alert.alert(
      isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      isWishlisted ? 'Course removed from your wishlist' : 'Course added to your wishlist'
    );
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={colors.warning}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image */}
      <Animated.View style={[{ height: headerHeight }, headerStyle]}>
        <Image 
          source={{ uri: courseData.image }}
          style={{ width: '100%', height: '100%' }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: 100 
          }}
        />
        
        {/* Header Actions */}
        <View className="absolute top-12 left-0 right-0 px-6 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              onPress={handleWishlist}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <Ionicons 
                name={isWishlisted ? 'heart' : 'heart-outline'} 
                size={20} 
                color={isWishlisted ? colors.error : 'white'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleShare}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Course Title Overlay */}
        <View className="absolute bottom-6 left-6 right-6">
          <Text className="text-white text-2xl font-bold mb-2">
            {courseData.title}
          </Text>
          <Text className="text-white/80 text-base">
            by {courseData.instructor.name}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1 -mt-8"
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View 
          className="rounded-t-3xl px-6 pt-8"
          style={{ backgroundColor: colors.background }}
        >
          {/* Course Stats */}
          <Card style={{ marginBottom: 24 }}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="flex-row mr-2">{renderStars(Math.floor(courseData.rating))}</View>
                <Text 
                  className="text-base font-semibold mr-2"
                  style={{ color: colors.text }}
                >
                  {courseData.rating}
                </Text>
                <Text 
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  ({courseData.reviews} reviews)
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Text 
                  className="text-2xl font-bold mr-2"
                  style={{ color: colors.primary }}
                >
                  ${courseData.price}
                </Text>
                <Text 
                  className="text-lg line-through"
                  style={{ color: colors.textTertiary }}
                >
                  ${courseData.originalPrice}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                <Text 
                  className="text-sm ml-1 mr-4"
                  style={{ color: colors.textSecondary }}
                >
                  {courseData.students.toLocaleString()} students
                </Text>
                
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text 
                  className="text-sm ml-1 mr-4"
                  style={{ color: colors.textSecondary }}
                >
                  {courseData.duration}
                </Text>
                
                <Ionicons name="library-outline" size={16} color={colors.textSecondary} />
                <Text 
                  className="text-sm ml-1"
                  style={{ color: colors.textSecondary }}
                >
                  {courseData.totalLessons} lessons
                </Text>
              </View>
            </View>
          </Card>

          {/* Tab Navigation */}
          <View className="flex-row mb-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'curriculum', label: 'Curriculum' },
              { key: 'instructor', label: 'Instructor' },
              { key: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 rounded-xl mr-2 ${
                  activeTab === tab.key ? '' : ''
                }`}
                style={{
                  backgroundColor: activeTab === tab.key ? colors.primary : 'transparent'
                }}
              >
                <Text 
                  className="text-center font-semibold"
                  style={{ 
                    color: activeTab === tab.key ? 'white' : colors.textSecondary 
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <View className="space-y-6">
              {/* Description */}
              <Card>
                <Text 
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  About This Course
                </Text>
                <Text 
                  className={`text-base leading-6 ${showFullDescription ? '' : 'mb-2'}`}
                  style={{ color: colors.textSecondary }}
                  numberOfLines={showFullDescription ? undefined : 3}
                >
                  {courseData.description}
                </Text>
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              </Card>

              {/* Features */}
              <Card>
                <Text 
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  This Course Includes
                </Text>
                <View className="space-y-3">
                  {courseData.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                      <Text 
                        className="ml-3 text-base"
                        style={{ color: colors.textSecondary }}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'curriculum' && (
            <View className="space-y-4">
              {courseData.curriculum.map((section) => (
                <Card key={section.id}>
                  <Text 
                    className="text-lg font-bold mb-4"
                    style={{ color: colors.text }}
                  >
                    {section.title}
                  </Text>
                  <View className="space-y-3">
                    {section.lessons.map((lesson) => (
                      <View key={lesson.id} className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View 
                            className="w-8 h-8 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: colors.primary + '20' }}
                          >
                            <Ionicons 
                              name={lesson.preview ? 'play-circle' : 'lock-closed'} 
                              size={16} 
                              color={lesson.preview ? colors.primary : colors.textTertiary} 
                            />
                          </View>
                          <Text 
                            className="flex-1 text-base"
                            style={{ color: colors.text }}
                          >
                            {lesson.title}
                          </Text>
                        </View>
                        <Text 
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {lesson.duration}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              ))}
            </View>
          )}

          {activeTab === 'instructor' && (
            <Card>
              <View className="flex-row items-center mb-4">
                <Image 
                  source={{ uri: courseData.instructor.avatar }}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text 
                    className="text-xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    {courseData.instructor.name}
                  </Text>
                  <Text 
                    className="text-base mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Senior React Native Developer
                  </Text>
                  <View className="flex-row">
                    {renderStars(Math.floor(courseData.instructor.rating))}
                    <Text 
                      className="ml-2 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {courseData.instructor.rating} instructor rating
                    </Text>
                  </View>
                </View>
              </View>
              
              <View className="flex-row justify-between mb-4">
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {courseData.instructor.students.toLocaleString()}
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Students
                  </Text>
                </View>
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {courseData.instructor.courses}
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Courses
                  </Text>
                </View>
                <View className="items-center">
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    5+
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Years Exp.
                  </Text>
                </View>
              </View>
              
              <Text 
                className="text-base"
                style={{ color: colors.textSecondary }}
              >
                John is a seasoned React Native developer with over 5 years of experience building cross-platform mobile applications. He has worked with Fortune 500 companies and startups alike.
              </Text>
            </Card>
          )}

          {activeTab === 'reviews' && (
            <View className="space-y-4">
              {courseData.reviewsData.map((review: any) => (
                <Card key={review.id}>
                  <View className="flex-row items-start">
                    <Image 
                      source={{ uri: review.avatar }}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text 
                          className="text-base font-semibold"
                          style={{ color: colors.text }}
                        >
                          {review.user}
                        </Text>
                        <Text 
                          className="text-sm"
                          style={{ color: colors.textTertiary }}
                        >
                          {review.date}
                        </Text>
                      </View>
                      
                      <View className="flex-row mb-2">
                        {renderStars(review.rating)}
                      </View>
                      
                      <Text 
                        className="text-base"
                        style={{ color: colors.textSecondary }}
                      >
                        {review.comment}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Enroll Button */}
      <Animated.View 
        style={[
          buttonAnimatedStyle,
          { 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border
          }
        ]}
      >
        <Button
          title={`Enroll Now - $${courseData.price}`}
          onPress={handleEnroll}
          fullWidth
          size="lg"
        />
      </Animated.View>
    </SafeAreaView>
  );
}