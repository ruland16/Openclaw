#!/usr/bin/env node
/**
 * Vector Memory Store Script
 * Stores memories with embeddings in PostgreSQL
 * 
 * Usage: node store-memory.js "memory content" --source="file.md" --agent="lui"
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Config
const PG_CONFIG = {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'openclaw_memory',
    user: process.env.PGUSER || 'openclaw',
    password: process.env.PGPASSWORD || '',
};

// Simple embedding function (placeholder - replace with actual API call)
async function getEmbedding(text) {
    // TODO: Replace with actual embedding API call
    // For now, return a random vector of correct dimensions
    // In production: use OpenAI, Ollama embeddings, or local model
    const dimensions = 1536;
    return Array.from({ length: dimensions }, () => (Math.random() * 2 - 1));
}

async function storeMemory(content, options = {}) {
    const pool = new Pool(PG_CONFIG);
    
    try {
        const embedding = await getEmbedding(content);
        
        const result = await pool.query(
            `INSERT INTO memory_entries (content, embedding, source_file, tags, agent_id, session_key)
             VALUES ($1, $2::vector, $3, $4, $5, $6)
             RETURNING id`,
            [
                content,
                `[${embedding.join(',')}]`,
                options.source || null,
                options.tags || [],
                options.agent || null,
                options.session || null
            ]
        );
        
        console.log(`✓ Stored memory entry #${result.rows[0].id}`);
        return result.rows[0].id;
    } catch (err) {
        console.error('Error storing memory:', err.message);
        throw err;
    } finally {
        await pool.end();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const content = args.find(a => !a.startsWith('--'));
    
    if (!content) {
        console.log('Usage: node store-memory.js "memory content" --source="file.md" --agent="lui" --tags=tag1,tag2');
        process.exit(1);
    }
    
    const options = {
        source: args.find(a => a.startsWith('--source='))?.split('=')[1],
        agent: args.find(a => a.startsWith('--agent='))?.split('=')[1],
        tags: args.find(a => a.startsWith('--tags='))?.split('=')[1]?.split(',') || []
    };
    
    storeMemory(content, options)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { storeMemory, getEmbedding };
