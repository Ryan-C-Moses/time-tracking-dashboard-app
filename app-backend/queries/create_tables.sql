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
  previous_time_spent_minutes INTEGER DEFAULT NULL
);

-- Task entries table
CREATE TABLE task_entries (
  id SERIAL PRIMARY KEY,
  task_entry_uuid UUID DEFAULT gen_random_uuid() UNIQUE, -- public id for API
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  time_spent_minutes INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
