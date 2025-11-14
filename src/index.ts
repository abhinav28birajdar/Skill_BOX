// Services
export { default as authService } from './services/auth';
export { default as categoryService } from './services/categories';
export { default as chatService } from './services/chat';
export { default as courseService } from './services/courses';
export { default as enrollmentService } from './services/enrollments';
export { default as liveSessionService } from './services/live-sessions';
export { default as notificationService } from './services/notifications';
export { default as reviewService } from './services/reviews';
export { default as showcaseService } from './services/showcases';
export { default as uploadService } from './services/upload';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useChat, useMessages } from './hooks/useChat';
export { useCourse, useCourses, useEnrollments } from './hooks/useCourses';
export { useNotifications } from './hooks/useNotifications';

// UI Components
export { Avatar } from './components/ui/Avatar';
export { Badge } from './components/ui/Badge';
export { BottomSheet } from './components/ui/BottomSheet';
export { Button } from './components/ui/Button';
export { Card } from './components/ui/Card';
export { EmptyState } from './components/ui/EmptyState';
export { Input } from './components/ui/Input';
export { LoadingSpinner } from './components/ui/LoadingSpinner';

// Course Components
export { CourseCard } from './components/course/CourseCard';
export { CourseProgress } from './components/course/CourseProgress';
export { LessonCard } from './components/course/LessonCard';
export { VideoPlayer } from './components/course/VideoPlayer';

// Chat Components
export { ChatList } from './components/chat/ChatList';
export { MessageBubble } from './components/chat/MessageBubble';
export { MessageInput } from './components/chat/MessageInput';

// Teacher Components
export { TeacherCard } from './components/teacher/TeacherCard';

// Types
export type * from './types/database';

// Constants
export * from './config/constants';
