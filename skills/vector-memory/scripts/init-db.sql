-- Vector Memory Database Setup
-- Run: psql -f init-db.sql

-- Create database (run as postgres user or superuser)
-- CREATE DATABASE openclaw_memory;

-- Connect to database: \c openclaw_memory

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create memories table (matches memory_flush.py schema)
CREATE TABLE IF NOT EXISTS memories (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    label TEXT,
    category TEXT,
    source TEXT,
    embedding vector(768),  -- Gemini embedding-001 dimensions
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lookups table
CREATE TABLE IF NOT EXISTS memory_lookups (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    results JSONB,
    looked_up_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops);

-- Create index for source lookups
CREATE INDEX IF NOT EXISTS idx_memories_source ON memories((metadata->>'source_file'));

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);

-- Create index for timestamp lookups
CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(created_at);
