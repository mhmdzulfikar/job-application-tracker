-- 1. Hancurkan tabel jobs lama (Tenang, tabel users lu ngga gua sentuh biar lu ngga usah register ulang)
DROP TABLE IF EXISTS jobs;

-- 2. Bangun ulang tabel jobs dengan spesifikasi DEWA (FULL FULLSTACK READY)
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Applied',
    salary VARCHAR(100),
    url TEXT,
    interview_date DATE,
    notes TEXT,
    tasks JSONB DEFAULT '[]'::jsonb,
    date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);