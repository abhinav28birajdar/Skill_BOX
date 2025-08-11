# SkillBox Database Setup Guide

## Prerequisites
1. A Supabase project
2. PostgreSQL client (optional, for direct database access)
3. Database connection details from Supabase

## Setup Steps

### 1. Initial Setup

1. Create a new Supabase project if you haven't already
2. Get your database connection details from the project settings
3. Enable the required extensions in Supabase:
   - uuid-ossp
   - pgcrypto
   - pg_trgm
   - btree_gin
   - postgis
   - unaccent

### 2. Schema Creation

1. Navigate to the SQL Editor in your Supabase dashboard
2. Run the consolidated schema from `database/consolidated_schema.sql`
3. Verify that all tables were created successfully

### 3. Database Migrations

Currently, we use direct SQL files for schema management. Future updates will implement proper migrations.

### 4. Environment Setup

1. Copy `.env.example` to `.env`
2. Update the following variables:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 5. Verify Setup

1. Check table creation:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. Verify RLS policies:
   ```sql
   SELECT schemaname, tablename, policyname, permissive
   FROM pg_policies 
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```

### 6. Initial Data (Optional)

1. Basic skills:
   ```sql
   INSERT INTO skills (name, description, category) 
   VALUES 
     ('JavaScript', 'Modern JavaScript programming', 'Programming'),
     ('React', 'React.js framework', 'Frontend'),
     ('Node.js', 'Server-side JavaScript', 'Backend');
   ```

2. Sample content types:
   ```sql
   -- Check consolidated_schema.sql for the complete list
   -- of content types in the content_type enum
   ```

## Common Issues

### Problem: RLS Policies Not Working
- Ensure you're using the correct authentication
- Verify policy syntax in consolidated_schema.sql
- Check user roles and permissions

### Problem: Enum Types
- If you need to modify enum types, you'll need to:
  1. Drop dependent columns
  2. Drop and recreate the enum
  3. Restore columns

## Maintenance

### Regular Tasks
1. Backup database (Supabase handles this automatically)
2. Monitor table sizes and performance
3. Check for unused indexes

### Performance
1. Use the provided indexes
2. Follow the query patterns in the schema
3. Monitor query performance with pg_stat_statements

## Security Considerations

1. Never disable RLS without understanding the implications
2. Keep service role key secure
3. Use appropriate user roles
4. Monitor failed authentication attempts

## Development Workflow

1. Make schema changes in development first
2. Test thoroughly with sample data
3. Create backup before applying to production
4. Use transactions for schema updates

## Resources

1. [Supabase Documentation](https://supabase.io/docs)
2. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
3. Schema Documentation: See `DATABASE_SCHEMA.md`
