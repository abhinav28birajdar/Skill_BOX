// Database types generated from Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          bio: string | null
          avatar_url: string | null
          categories: string[] | null
          interests: string[] | null
          portfolio: Json | null
          experience: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          bio?: string | null
          avatar_url?: string | null
          categories?: string[] | null
          interests?: string[] | null
          portfolio?: Json | null
          experience?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          bio?: string | null
          avatar_url?: string | null
          categories?: string[] | null
          interests?: string[] | null
          portfolio?: Json | null
          experience?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          icon: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          icon?: string | null
          description?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          teacher_id: string
          title: string
          description: string | null
          cover_url: string | null
          category_id: number | null
          is_published: boolean
          skill_level: 'beginner' | 'intermediate' | 'advanced'
          language: string
          price: number
          rating: number
          total_students: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          title: string
          description?: string | null
          cover_url?: string | null
          category_id?: number | null
          is_published?: boolean
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          language?: string
          price?: number
          rating?: number
          total_students?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          title?: string
          description?: string | null
          cover_url?: string | null
          category_id?: number | null
          is_published?: boolean
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          language?: string
          price?: number
          rating?: number
          total_students?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          video_url: string | null
          document_url: string | null
          text_content: string | null
          order_index: number
          duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          video_url?: string | null
          document_url?: string | null
          text_content?: string | null
          order_index: number
          duration?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          video_url?: string | null
          document_url?: string | null
          text_content?: string | null
          order_index?: number
          duration?: number
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          course_id: string
          student_id: string
          progress: Json
          completed_lessons: number
          total_lessons: number
          progress_percentage: number
          enrolled_at: string
          last_accessed: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          progress?: Json
          completed_lessons?: number
          total_lessons?: number
          progress_percentage?: number
          enrolled_at?: string
          last_accessed?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          progress?: Json
          completed_lessons?: number
          total_lessons?: number
          progress_percentage?: number
          enrolled_at?: string
          last_accessed?: string
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          body: string
          attachment_url: string | null
          attachment_type: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          body: string
          attachment_url?: string | null
          attachment_type?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          body?: string
          attachment_url?: string | null
          attachment_type?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          course_id: string | null
          participants: string[]
          thread_type: 'personal' | 'group'
          last_message: string | null
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          participants: string[]
          thread_type?: 'personal' | 'group'
          last_message?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          participants?: string[]
          thread_type?: 'personal' | 'group'
          last_message?: string | null
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string | null
          payload: Json
          notification_type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body?: string | null
          payload?: Json
          notification_type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string | null
          payload?: Json
          notification_type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      live_sessions: {
        Row: {
          id: string
          course_id: string
          teacher_id: string
          title: string
          description: string | null
          start_time: string
          duration: number
          meeting_url: string | null
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          teacher_id: string
          title: string
          description?: string | null
          start_time: string
          duration?: number
          meeting_url?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          teacher_id?: string
          title?: string
          description?: string | null
          start_time?: string
          duration?: number
          meeting_url?: string | null
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          course_id: string
          student_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      showcases: {
        Row: {
          id: string
          student_id: string
          course_id: string
          title: string
          description: string | null
          media_url: string
          media_type: 'image' | 'video' | 'document'
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          title: string
          description?: string | null
          media_url: string
          media_type: 'image' | 'video' | 'document'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          title?: string
          description?: string | null
          media_url?: string
          media_type?: 'image' | 'video' | 'document'
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Thread = Database['public']['Tables']['threads']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Showcase = Database['public']['Tables']['showcases']['Row']

export interface UserWithProfile extends User {
  profiles: Profile
}

export interface CourseWithDetails extends Course {
  profiles: Profile
  categories: Category
  enrollments?: Enrollment[]
  lessons?: Lesson[]
}

export interface MessageWithSender extends Message {
  sender: Profile
}

export interface ThreadWithParticipants extends Thread {
  participant_profiles: Profile[]
}
