CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,                           -- internal DB id
  user_uuid UUID DEFAULT gen_random_uuid() UNIQUE, -- public id for API
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  task_uuid UUID DEFAULT gen_random_uuid() UNIQUE, -- public id for API
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('daily', 'weekly', 'monthly')),
  category TEXT NOT NULL CHECK (category IN ('work', 'play', 'study', 'exercise', 'social', 'self-care')),
  previous_duration INTEGER DEFAULT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks archive table
CREATE TABLE tasks_archive (LIKE tasks INCLUDING ALL);
ALTER TABLE tasks_archive
  ADD COLUMN deleted_at TIMESTAMP NOT NULL DEFAULT now();

-- Create Trigger Function
CREATE OR REPLACE FUNCTION archive_tasks_before_delete()
RETURNS trigger
LANGUAGE plpgsql as $$
BEGIN
  INSERT INTO tasks_archive
  SELECT OLD.*, now();
  RETURN OLD;
END;
$$;

-- ATTACH Trigger Function to table
CREATE TRIGGER trg_tasks_archive_before_delete
BEFORE DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION archive_tasks_before_delete();


-- Task entries table - OUTDATED 
-- CREATE TABLE task_entries (
--   id SERIAL PRIMARY KEY,
--   task_entry_uuid UUID DEFAULT gen_random_uuid() UNIQUE, -- public id for API
--   task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
--   time_spent_minutes INTEGER NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
