-- Enable required extensions
create extension if not exists "vector" with schema public;
create extension if not exists "pg_stat_statements" with schema public;

-- Bio-cognitive data tables
create table "public"."bio_cognitive_history" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "user_id" uuid not null references auth.users(id),
    "biometric_data" jsonb not null,
    "cognitive_state" jsonb not null,
    "embedding" vector(1536),
    
    constraint bio_cognitive_history_pkey primary key (id)
);

-- Add row level security
alter table "public"."bio_cognitive_history" enable row level security;

create policy "Users can view own bio-cognitive data"
on "public"."bio_cognitive_history"
for select using (
    auth.uid() = user_id
);

create policy "Users can insert own bio-cognitive data"
on "public"."bio_cognitive_history"
for insert with check (
    auth.uid() = user_id
);

-- Create views for analytics
create view "public"."user_cognitive_trends" as
select 
    user_id,
    date_trunc('hour', created_at) as time_bucket,
    avg((cognitive_state->>'focus_level')::float) as avg_focus,
    avg((cognitive_state->>'cognitive_load')::float) as avg_cognitive_load,
    avg((cognitive_state->>'learning_readiness')::float) as avg_learning_readiness,
    mode() within group (order by cognitive_state->>'emotional_state') as dominant_emotion,
    mode() within group (order by cognitive_state->>'optimal_content_type') as optimal_content_type
from "public"."bio_cognitive_history"
group by user_id, date_trunc('hour', created_at);

-- Create functions for real-time processing
create or replace function process_biometric_data(
    p_user_id uuid,
    p_biometric_data jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_cognitive_state jsonb;
    v_recommendations text[];
begin
    -- Process biometric data
    v_cognitive_state = jsonb_build_object(
        'focus_level', (
            coalesce((p_biometric_data->>'eye_tracking'->>'fixation_duration')::float, 0) * 0.4 +
            coalesce((p_biometric_data->>'facial_expressions'->>'attention')::float, 0) * 0.3 +
            coalesce((p_biometric_data->>'eeg_patterns'->0)::float, 0) * 0.3
        ),
        'cognitive_load', (
            coalesce((p_biometric_data->>'eye_tracking'->>'pupil_dilation')::float, 0) * 0.3 +
            (coalesce((p_biometric_data->>'heart_rate')::float, 60) - 60) / 100 * 0.3 +
            coalesce((p_biometric_data->>'gsr_level')::float, 0) * 0.4
        ),
        'emotional_state', coalesce(p_biometric_data->>'facial_expressions'->>'emotion', 'neutral'),
        'timestamp', now()
    );
    
    -- Insert into history
    insert into bio_cognitive_history (user_id, biometric_data, cognitive_state)
    values (p_user_id, p_biometric_data, v_cognitive_state);
    
    return v_cognitive_state;
end;
$$;

-- Create function to get learning recommendations
create or replace function get_learning_recommendations(
    p_cognitive_state jsonb
) returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
    v_recommendations text[] := array[]::text[];
begin
    -- Focus-based recommendations
    if (p_cognitive_state->>'focus_level')::float < 0.3 then
        v_recommendations := array_append(v_recommendations, 'Take a short break');
        v_recommendations := array_append(v_recommendations, 'Try mindfulness exercises');
    end if;
    
    -- Cognitive load recommendations
    if (p_cognitive_state->>'cognitive_load')::float > 0.7 then
        v_recommendations := array_append(v_recommendations, 'Break content into smaller chunks');
        v_recommendations := array_append(v_recommendations, 'Review foundational concepts');
    end if;
    
    return v_recommendations;
end;
$$;

-- Create realtime notification function
create or replace function notify_cognitive_state_change()
returns trigger
language plpgsql
as $$
begin
    perform pg_notify(
        'cognitive_state_update',
        json_build_object(
            'user_id', NEW.user_id,
            'cognitive_state', NEW.cognitive_state
        )::text
    );
    return NEW;
end;
$$;

-- Create trigger for realtime notifications
create trigger cognitive_state_change_trigger
after insert on bio_cognitive_history
for each row
execute function notify_cognitive_state_change();
