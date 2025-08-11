# SkillBox Database Schema Documentation

## Overview
This document provides an overview of the SkillBox platform's database schema design. The schema is implemented in PostgreSQL and uses Supabase for authentication and row-level security.

## Core Features

### User Management
- Extended user profiles with learning preferences and statistics
- Teacher profiles with professional information and metrics
- Row-level security for data privacy

### Content Management
- Support for various content types (video, audio, document, etc.)
- Course structure with modules and lessons
- Skills taxonomy and difficulty levels

### Learning Features
- Progress tracking at both course and content level
- Enrollment management
- Achievement system with streaks and points

### Social Features
- Following system for users
- Comments and reviews
- Content rating and feedback

### Business Features
- Payment processing and transaction history
- Teacher earnings and platform fees
- Premium content management

## Schema Structure

### Core Tables

#### Users
- Extended from Supabase auth.users
- Stores user preferences and settings
- Tracks achievement points and streaks
- Manages notification preferences

#### Teacher Profiles
- Professional information for teachers
- Teaching qualifications and experience
- Performance metrics and earnings data

### Content Tables

#### Learning Content
- Base table for all educational content
- Supports multiple content types
- Tracks engagement metrics (views, likes, etc.)

#### Courses
- Structured learning paths
- Organized into modules and lessons
- Progress tracking and completion rates

### Progress Tables

#### Course Enrollments
- Student enrollment management
- Progress tracking
- Completion status

#### User Progress
- Detailed progress tracking for content
- Time spent and position tracking
- Completion status management

### Social Tables

#### Comments & Reviews
- Content feedback system
- Course reviews and ratings
- User-to-user interactions

### Financial Tables

#### Transactions
- Payment processing
- Course and content purchases
- Platform fee management

## Security Features

### Row Level Security
- User data protection
- Content access control
- Transaction privacy

### Permissions
- Role-based access control
- Content visibility rules
- Administrative controls

## Performance Optimizations

### Indexes
- Optimized queries for common operations
- Social feature performance
- Content discovery acceleration

### Functions
- Course progress calculation
- Achievement tracking
- Automated updates

## Maintenance

### Triggers
- Automatic timestamp updates
- Progress calculation
- Statistics maintenance

## Usage Guidelines

1. Always use the provided functions for common calculations
2. Respect row-level security in application code
3. Use appropriate indexes for queries
4. Follow the established naming conventions

## Support

For technical support or questions about the database schema:
1. Review the SQL files for detailed implementation
2. Check the function documentation for usage
3. Refer to PostgreSQL and Supabase documentation
