-- Intelligent Conversational AI for Crime Database
-- PostgreSQL + pgvector Schema Definition
-- Synthetic Demo Data ONLY

-- Enable pgvector extension if available in PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop table if exists
DROP TABLE IF EXISTS crime_records;

-- Create crime_records table
CREATE TABLE crime_records (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    victim_age INT,
    suspect_age INT,
    status VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    embedding vector(384)
);

-- Indexes for structured filtering
CREATE INDEX IF NOT EXISTS idx_crime_records_type ON crime_records(crime_type);
CREATE INDEX IF NOT EXISTS idx_crime_records_location ON crime_records(location);
CREATE INDEX IF NOT EXISTS idx_crime_records_date ON crime_records(incident_date);
CREATE INDEX IF NOT EXISTS idx_crime_records_status ON crime_records(status);
CREATE INDEX IF NOT EXISTS idx_crime_records_severity ON crime_records(severity);

-- HNSW Vector Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_crime_records_embedding_hnsw 
ON crime_records USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
