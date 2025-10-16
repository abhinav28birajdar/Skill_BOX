import {
    Button,
    ContentCard,
    FilterChip,
    Input,
    NotificationPanel,
    NotificationProvider,
    Progress,
    SearchBar,
    SkillBoxNotifications,
    SkillProgress,
    TeacherCard,
    TeacherSpeedDial,
    useNotifications
} from '@/components/ui';
import { useTheme } from '@/constants/Theme';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Demo Content Component
function DemoContent() {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(65);

  const handleAddNotification = () => {
    addNotification(
      SkillBoxNotifications.courseEnrollment(
        'React Native Development',
        () => console.log('View Course')
      )
    );
  };

  const handleProgressDemo = () => {
    setProgress(Math.min(100, progress + 10));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            SkillBox UI Components Demo
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Comprehensive learning platform components
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Search & Navigation
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search courses, skills, or teachers..."
            showSuggestions={true}
            suggestions={[
              'React Native Development',
              'JavaScript Fundamentals',
              'UI/UX Design',
              'Machine Learning',
              'Data Science',
            ]}
          />
          
          <View style={styles.chipContainer}>
            <FilterChip label="Programming" active={true} />
            <FilterChip label="Design" />
            <FilterChip label="Business" />
            <FilterChip label="Free" removable={true} />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Action Buttons
          </Text>
          <View style={styles.buttonRow}>
            <Button
              title="Enroll Now"
              variant="primary"
              style={styles.button}
              onPress={handleAddNotification}
            />
            <Button
              title="Preview"
              variant="ghost"
              style={styles.button}
            />
          </View>
          <View style={styles.buttonRow}>
            <Button
              title="Join Class"
              variant="success"
              size="lg"
              style={styles.button}
            />
            <Button
              title="Save"
              variant="secondary"
              size="sm"
              style={styles.button}
            />
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Form Inputs
          </Text>
          <Input
            label="Course Title"
            placeholder="Enter course title..."
          />
          <Input
            label="Description"
            placeholder="Course description..."
            multiline={true}
            numberOfLines={3}
          />
          <Input
            label="Price"
            placeholder="$99.99"
            keyboardType="numeric"
          />
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Progress Tracking
          </Text>
          <View style={styles.progressContainer}>
            <Progress
              value={progress}
              showLabel={true}
              labelPosition="outside"
              style={styles.progressBar}
            />
            <Button
              title="Increase Progress"
              variant="ghost"
              size="sm"
              onPress={handleProgressDemo}
            />
          </View>
          
          <SkillProgress
            skill="React Native"
            level={3}
            progress={75}
            style={styles.skillProgress}
          />
        </View>

        {/* Cards Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Content Cards
          </Text>
          
          <ContentCard
            title="React Native Mastery"
            description="Complete guide to building mobile apps with React Native. Learn from basics to advanced concepts."
            instructor="John Smith"
            rating={4.8}
            price={99.99}
            imageUrl="https://example.com/course-image.jpg"
            duration="12 hours"
            level="Intermediate"
            style={styles.card}
          />

          <TeacherCard
            name="Sarah Johnson"
            bio="5+ years of mobile development experience. Passionate about teaching and helping students achieve their goals."
            rating={4.9}
            studentsCount={2500}
            coursesCount={12}
            profileImage="https://example.com/avatar.jpg"
            skills={['React Native', 'JavaScript', 'Mobile Development']}
            style={styles.card}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Notifications
          </Text>
          <NotificationPanel
            maxHeight={300}
            style={styles.notificationPanel}
          />
        </View>

        {/* Spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TeacherSpeedDial />
    </SafeAreaView>
  );
}

// Main Demo Component with Notification Provider
export default function UIComponentsDemo() {
  return (
    <NotificationProvider>
      <DemoContent />
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    marginBottom: 12,
  },
  skillProgress: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 16,
  },
  notificationPanel: {
    marginBottom: 16,
  },
});
