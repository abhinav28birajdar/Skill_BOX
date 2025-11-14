import { useEffect, useState } from 'react';
import courseService from '../services/courses';
import enrollmentService from '../services/enrollments';

export const useCourses = (filters?: {
  category?: number;
  skill_level?: string;
  search?: string;
  teacher_id?: string;
}) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses(filters);
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadCourses();
  };

  return {
    courses,
    loading,
    error,
    refresh,
  };
};

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    const courseData = await courseService.getCourseById(courseId);
    const lessonsData = await courseService.getCourseLessons(courseId);
    setCourse(courseData);
    setLessons(lessonsData);
    setLoading(false);
  };

  return {
    course,
    lessons,
    loading,
    refresh: loadCourse,
  };
};

export const useEnrollments = (studentId: string) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, [studentId]);

  const loadEnrollments = async () => {
    setLoading(true);
    const data = await enrollmentService.getStudentEnrollments(studentId);
    setEnrollments(data);
    setLoading(false);
  };

  return {
    enrollments,
    loading,
    refresh: loadEnrollments,
  };
};
