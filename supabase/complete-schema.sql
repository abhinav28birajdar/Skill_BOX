-- ========================================
-- SkillBox Complete Database Schema
-- ========================================
-- This file contains the complete database setup for SkillBox
-- Run this in Supabase SQL Editor to set up the entire database

-- ----------------------------------------
-- Extensions & Basic Setup
-- ----------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------
-- Core Tables
-- ----------------------------------------

-- Users table with roles
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text check (role in ('student','teacher','admin')) default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles table
create table public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  name text,
  bio text,
  avatar_url text,
  categories text[],
  interests text[],
  portfolio jsonb default '[]'::jsonb,
  experience text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories table
create table public.categories (
  id serial primary key,
  name text not null unique,
  icon text,
  description text,
  created_at timestamptz default now()
);

-- Courses table
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  category_id int references public.categories(id),
  is_published boolean default false,
  skill_level text check (skill_level in ('beginner','intermediate','advanced')) default 'beginner',
  language text default 'English',
  price decimal(10,2) default 0,
  rating decimal(3,2) default 0,
  total_students int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lessons table
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  video_url text,
  document_url text,
  text_content text,
  order_index int not null,
  duration int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enrollments table
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  progress jsonb default '{}'::jsonb,
  completed_lessons int default 0,
  total_lessons int default 0,
  progress_percentage int default 0,
  enrolled_at timestamptz default now(),
  last_accessed timestamptz default now(),
  unique(course_id, student_id)
);

-- Messages table (for chat)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null,
  sender_id uuid references public.users(id) on delete cascade,
  body text not null,
  attachment_url text,
  attachment_type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Threads table (for chat conversations)
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  participants uuid[] not null,
  thread_type text check (thread_type in ('personal','group')) default 'personal',
  last_message text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  body text,
  payload jsonb default '{}'::jsonb,
  notification_type text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Live sessions table
create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  duration int default 60,
  meeting_url text,
  status text check (status in ('scheduled','ongoing','completed','cancelled')) default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(course_id, student_id)
);

-- Student showcase table
create table public.showcases (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  media_url text not null,
  media_type text check (media_type in ('image','video','document')) not null,
  created_at timestamptz default now()
);

-- ----------------------------------------
-- Indexes for Performance
-- ----------------------------------------
create index idx_courses_teacher on public.courses(teacher_id);
create index idx_courses_category on public.courses(category_id);
create index idx_courses_published on public.courses(is_published);
create index idx_lessons_course on public.lessons(course_id);
create index idx_enrollments_student on public.enrollments(student_id);
create index idx_enrollments_course on public.enrollments(course_id);
create index idx_messages_thread on public.messages(thread_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read);
create index idx_live_sessions_course on public.live_sessions(course_id);
create index idx_reviews_course on public.reviews(course_id);
create index idx_showcases_student on public.showcases(student_id);

-- ----------------------------------------
-- Row Level Security Setup
-- ----------------------------------------
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.messages enable row level security;
alter table public.threads enable row level security;
alter table public.notifications enable row level security;
alter table public.live_sessions enable row level security;
alter table public.reviews enable row level security;
alter table public.showcases enable row level security;

-- ----------------------------------------
-- RLS Policies
-- ----------------------------------------

-- Users Policies
create policy "Users can view their own data" on public.users for select using (auth.uid() = id);
create policy "Users can update their own data" on public.users for update using (auth.uid() = id);

-- Profiles Policies
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Categories Policies
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Courses Policies
create policy "Published courses are viewable by everyone" on public.courses for select using (is_published = true or teacher_id = auth.uid());
create policy "Teachers can insert their own courses" on public.courses for insert with check (auth.uid() = teacher_id);
create policy "Teachers can update their own courses" on public.courses for update using (auth.uid() = teacher_id);
create policy "Teachers can delete their own courses" on public.courses for delete using (auth.uid() = teacher_id);

-- Lessons Policies
create policy "Lessons are viewable by enrolled students and teachers" on public.lessons for select using (
  exists (
    select 1 from public.courses c
    where c.id = course_id and (c.teacher_id = auth.uid() or c.is_published = true)
  )
);
create policy "Teachers can insert lessons" on public.lessons for insert with check (
  exists (select 1 from public.courses where id = course_id and teacher_id = auth.uid())
);
create policy "Teachers can update lessons" on public.lessons for update using (
  exists (select 1 from public.courses where id = course_id and teacher_id = auth.uid())
);
create policy "Teachers can delete lessons" on public.lessons for delete using (
  exists (select 1 from public.courses where id = course_id and teacher_id = auth.uid())
);

-- Enrollments Policies
create policy "Users can view their own enrollments" on public.enrollments for select using (auth.uid() = student_id);
create policy "Students can enroll themselves" on public.enrollments for insert with check (auth.uid() = student_id);
create policy "Students can update their enrollment progress" on public.enrollments for update using (auth.uid() = student_id);

-- Messages Policies
create policy "Users can view messages in their threads" on public.messages for select using (
  exists (select 1 from public.threads where id = thread_id and auth.uid() = any(participants))
);
create policy "Users can send messages to their threads" on public.messages for insert with check (
  exists (select 1 from public.threads where id = thread_id and auth.uid() = any(participants))
);

-- Threads Policies
create policy "Users can view their threads" on public.threads for select using (auth.uid() = any(participants));
create policy "Users can create threads" on public.threads for insert with check (auth.uid() = any(participants));
create policy "Users can update their threads" on public.threads for update using (auth.uid() = any(participants));

-- Notifications Policies
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Live Sessions Policies
create policy "Live sessions are viewable by enrolled students and teachers" on public.live_sessions for select using (
  exists (
    select 1 from public.courses c
    where c.id = course_id and (c.teacher_id = auth.uid() or exists (
      select 1 from public.enrollments e where e.course_id = c.id and e.student_id = auth.uid()
    ))
  )
);
create policy "Teachers can manage live sessions" on public.live_sessions for all using (auth.uid() = teacher_id);

-- Reviews Policies
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Students can insert their own reviews" on public.reviews for insert with check (auth.uid() = student_id);
create policy "Students can update their own reviews" on public.reviews for update using (auth.uid() = student_id);

-- Showcases Policies
create policy "Showcases are viewable by everyone" on public.showcases for select using (true);
create policy "Students can insert their own showcases" on public.showcases for insert with check (auth.uid() = student_id);
create policy "Students can delete their own showcases" on public.showcases for delete using (auth.uid() = student_id);

-- ----------------------------------------
-- Functions & Triggers
-- ----------------------------------------

-- Function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'student');
  
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_users_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_courses_updated_at before update on public.courses
  for each row execute procedure public.handle_updated_at();

create trigger handle_lessons_updated_at before update on public.lessons
  for each row execute procedure public.handle_updated_at();

create trigger handle_threads_updated_at before update on public.threads
  for each row execute procedure public.handle_updated_at();

create trigger handle_live_sessions_updated_at before update on public.live_sessions
  for each row execute procedure public.handle_updated_at();

create trigger handle_reviews_updated_at before update on public.reviews
  for each row execute procedure public.handle_updated_at();

-- ----------------------------------------
-- Storage Buckets
-- ----------------------------------------
insert into storage.buckets (id, name, public) values
('avatars', 'avatars', true),
('course-covers', 'course-covers', true),
('course-videos', 'course-videos', false),
('course-documents', 'course-documents', false),
('chat-attachments', 'chat-attachments', false),
('showcases', 'showcases', true)
on conflict (id) do nothing;

-- ----------------------------------------
-- Storage Policies
-- ----------------------------------------

-- Avatars Storage Policies
create policy "Avatar images are publicly accessible"
on storage.objects for select using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
on storage.objects for insert with check ( bucket_id = 'avatars' );

create policy "Users can update their own avatar"
on storage.objects for update using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own avatar"
on storage.objects for delete using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- Course Covers Storage Policies
create policy "Course covers are publicly accessible"
on storage.objects for select using ( bucket_id = 'course-covers' );

create policy "Teachers can upload course covers"
on storage.objects for insert with check ( bucket_id = 'course-covers' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Teachers can update their course covers"
on storage.objects for update using ( bucket_id = 'course-covers' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Teachers can delete their course covers"
on storage.objects for delete using ( bucket_id = 'course-covers' and auth.uid()::text = (storage.foldername(name))[1] );

-- Course Videos Storage Policies
create policy "Enrolled students can view course videos"
on storage.objects for select using (
  bucket_id = 'course-videos' and (
    auth.uid()::text = (storage.foldername(name))[1] or
    exists (
      select 1 from public.enrollments e
      inner join public.courses c on c.id = e.course_id
      where e.student_id = auth.uid() and c.teacher_id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "Teachers can upload course videos"
on storage.objects for insert with check ( bucket_id = 'course-videos' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Teachers can delete course videos"
on storage.objects for delete using ( bucket_id = 'course-videos' and auth.uid()::text = (storage.foldername(name))[1] );

-- Course Documents Storage Policies
create policy "Enrolled students can view course documents"
on storage.objects for select using (
  bucket_id = 'course-documents' and (
    auth.uid()::text = (storage.foldername(name))[1] or
    exists (
      select 1 from public.enrollments e
      inner join public.courses c on c.id = e.course_id
      where e.student_id = auth.uid() and c.teacher_id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "Teachers can upload course documents"
on storage.objects for insert with check ( bucket_id = 'course-documents' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Teachers can delete course documents"
on storage.objects for delete using ( bucket_id = 'course-documents' and auth.uid()::text = (storage.foldername(name))[1] );

-- Chat Attachments Storage Policies
create policy "Thread participants can view attachments"
on storage.objects for select using (
  bucket_id = 'chat-attachments' and
  exists (
    select 1 from public.threads t
    where t.id::text = (storage.foldername(name))[1] and auth.uid() = any(t.participants)
  )
);

create policy "Thread participants can upload attachments"
on storage.objects for insert with check (
  bucket_id = 'chat-attachments' and
  exists (
    select 1 from public.threads t
    where t.id::text = (storage.foldername(name))[1] and auth.uid() = any(t.participants)
  )
);

-- Showcases Storage Policies
create policy "Showcases are publicly accessible"
on storage.objects for select using ( bucket_id = 'showcases' );

create policy "Students can upload showcases"
on storage.objects for insert with check ( bucket_id = 'showcases' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Students can delete their showcases"
on storage.objects for delete using ( bucket_id = 'showcases' and auth.uid()::text = (storage.foldername(name))[1] );

-- ----------------------------------------
-- Default Data
-- ----------------------------------------
insert into public.categories (name, icon, description) values
('Photography', '📸', 'Learn photography techniques and camera skills'),
('Video Editing', '🎬', 'Master video editing software and techniques'),
('Graphic Design', '🎨', 'Create stunning visual designs'),
('Dance', '💃', 'Learn various dance styles and choreography'),
('Music', '🎵', 'Master musical instruments and theory'),
('Programming', '💻', 'Learn coding and software development'),
('Business', '💼', 'Develop business and entrepreneurship skills'),
('Marketing', '📊', 'Master digital marketing strategies'),
('Writing', '✍️', 'Improve your writing and storytelling'),
('Fitness', '💪', 'Get fit with professional training')
on conflict (name) do nothing;
