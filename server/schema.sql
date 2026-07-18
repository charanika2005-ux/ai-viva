-- ============================================
-- AI Viva & Interview Panel Simulator
-- Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Users table (standalone, managed by backend JWT auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('hr', 'technical', 'viva')),
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_count INTEGER NOT NULL DEFAULT 10,
  questions JSONB DEFAULT '[]',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
  overall_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  improvement_plan JSONB DEFAULT '[]',
  top_weak_topics JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer_text TEXT DEFAULT '',
  evaluation JSONB DEFAULT '{}',
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  overall_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  improvement_plan JSONB DEFAULT '[]',
  top_weak_topics JSONB DEFAULT '[]',
  summary TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_answers_interview_id ON answers(interview_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_interview_id ON reports(interview_id);

-- Disable RLS (backend uses service-role key, handles auth via JWT)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
