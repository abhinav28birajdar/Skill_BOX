import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard } from '../../src/components/course/CourseCard';
import { Badge } from '../../src/components/ui/Badge';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Input } from '../../src/components/ui/Input';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import categoryService from '../../src/services/categories';
import courseService from '../../src/services/courses';

export default function ExploreScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const [coursesData, categoriesData] = await Promise.all([
      courseService.getAllCourses({
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
      }),
      categoryService.getAllCategories(),
    ]);
    setCourses(coursesData);
    setCategories(categoriesData);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading courses..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        stickyHeaderIndices={[0]}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#FFFFFF', paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: '#1C1C1E',
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            Explore Courses
          </Text>

          {/* Search */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon="search"
            />
          </View>

          {/* Categories */}
          <FlatList
            horizontal
            data={[{ id: null, name: 'All' }, ...categories]}
            keyExtractor={(item) => item.id?.toString() || 'all'}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                style={{ marginHorizontal: 4 }}
              >
                <Badge
                  text={item.name}
                  variant={selectedCategory === item.id ? 'primary' : 'info'}
                />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Courses */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          {courses.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No courses found"
              description="Try adjusting your search or filters"
            />
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => router.push('/(student)/explore')}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
