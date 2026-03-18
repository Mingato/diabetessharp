-- NeuroSharp PostgreSQL Schema
-- Run with: psql $DATABASE_URL -f server/src/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'affiliate')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS funnel_orders (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  "cognitiveProfile" VARCHAR(100),
  "symptomSeverity" VARCHAR(50),
  "familyHistory" SMALLINT DEFAULT 0,
  "quizSessionId" VARCHAR(100),
  "cognitiveRiskScore" INT,
  "discountApplied" INT DEFAULT 0,
  "amountPaid" INT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  "credentialsSent" SMALLINT DEFAULT 0,
  "generatedLogin" VARCHAR(255),
  "upsell1Purchased" SMALLINT DEFAULT 0,
  "upsell2Purchased" SMALLINT DEFAULT 0,
  "upsell3Purchased" SMALLINT DEFAULT 0,
  "affiliateId" INT,
  "affiliateCode" VARCHAR(100),
  "refCode" VARCHAR(100),
  "userId" INT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cognitive_progress (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  "cognitiveScore" INT,
  "memoryScore" INT,
  "processingSpeed" INT,
  "attentionScore" INT,
  "dailyExercisesCompleted" INT DEFAULT 0,
  "exerciseMinutes" INT DEFAULT 0,
  "dailyStreak" INT DEFAULT 0,
  "phaseNumber" INT DEFAULT 1,
  UNIQUE ("userId", date)
);

CREATE TABLE IF NOT EXISTS daily_exercises (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id),
  date DATE,
  "exerciseType" VARCHAR(100),
  difficulty INT,
  "successRate" DECIMAL(5,2),
  "timeSpent" INT,
  completed SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  code VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  tier INT DEFAULT 1,
  "totalCommissionEarned" DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id SERIAL PRIMARY KEY,
  "affiliateId" INT NOT NULL REFERENCES affiliates(id),
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id SERIAL PRIMARY KEY,
  "affiliateId" INT NOT NULL REFERENCES affiliates(id),
  "orderId" INT NOT NULL REFERENCES funnel_orders(id),
  "commissionAmount" DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id SERIAL PRIMARY KEY,
  "affiliateId" INT NOT NULL REFERENCES affiliates(id),
  amount DECIMAL(10,2),
  "payoutMethod" VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  category VARCHAR(100),
  subject VARCHAR(255),
  message TEXT,
  "orderId" INT REFERENCES funnel_orders(id),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'replied', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_sequences (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES users(id),
  "sequenceType" VARCHAR(100),
  "emailSent" SMALLINT DEFAULT 0,
  "sentAt" TIMESTAMPTZ,
  opened SMALLINT DEFAULT 0,
  clicked SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_completions (
  id SERIAL PRIMARY KEY,
  "sessionId" VARCHAR(100) UNIQUE,
  age INT,
  "primaryConcern" VARCHAR(100),
  "symptomSeverity" VARCHAR(50),
  "familyHistory" SMALLINT,
  "currentHabits" VARCHAR(255),
  "motivationLevel" VARCHAR(50),
  "cognitiveRiskScore" INT,
  converted SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_funnel_orders_email ON funnel_orders(email);
CREATE INDEX IF NOT EXISTS idx_funnel_orders_status ON funnel_orders(status);
CREATE INDEX IF NOT EXISTS idx_cognitive_progress_user_date ON cognitive_progress("userId", date);
CREATE INDEX IF NOT EXISTS idx_daily_exercises_user_date ON daily_exercises("userId", date);
CREATE INDEX IF NOT EXISTS idx_quiz_completions_session ON quiz_completions("sessionId");
