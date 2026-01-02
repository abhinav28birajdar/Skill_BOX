import { CourseCard } from '@/src/components/course/CourseCard';
import { Avatar } from '@/src/components/ui/Avatar';
import { Badge } from '@/src/components/ui/Badge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/hooks/useAuth';
import categoryService from '@/src/services/categories';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentHomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  
  // Mock data for now since the hooks are not available
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  
  const refreshCourses = async () => {};
  const refreshEnrollments = async () => {};
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await categoryService.getAllCategories();
    setCategories(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshCourses(), refreshEnrollments(), loadCategories()]);
    setRefreshing(false);
  };

  if (coursesLoading || enrollmentsLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: '#1C1C1E',
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#8E8E93',
                marginTop: 4,
              }}
            >
              {profile?.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(student)/profile')}>
            <Avatar uri={profile?.avatar_url || undefined} name={profile?.name || undefined} size={44} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/(student)/explore')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F2F2F7',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Ionicons name="search" size={20} color="#8E8E93" />
            <Text
              style={{
                fontSize: 16,
                color: '#8E8E93',
                marginLeft: 12,
              }}
            >
              Search courses...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#1C1C1E',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            Categories
          </Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(student)/explore',
                    params: { category: item.id },
                  })
                }
                style={{
                  marginHorizontal: 4,
                }}
              >
                <Badge text={item.name} variant="primary" />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Continue Learning */}
        {enrollments.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: '#1C1C1E',
                }}
              >
                Continue Learning
              </Text>
              <TouchableOpacity onPress={() => router.push('/(student)/my-courses')}>
                <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={enrollments.slice(0, 5)}
              keyExtractor={(item) => (item as any).id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ width: 280, marginHorizontal: 4 }}>
                  <CourseCard
                    course={(item as any).courses}
                    onPress={() =>
                      router.push('/(student)/explore')
                    }
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Recommended Courses */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#1C1C1E',
              marginBottom: 16,
            }}
          >
            Recommended for You
          </Text>

          {courses.length === 0 ? (
            <EmptyState
              icon="book-outline"
              title="No courses yet"
              description="New courses will appear here"
            />
          ) : (
            courses
              .slice(0, 5)
              .map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() =>
                    router.push('/(student)/explore')
                  }
                />
              ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
