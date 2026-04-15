#!/usr/bin/env node
/**
 * Vector Memory Search Script
 * Semantic search through stored memories
 * 
 * Usage: node search-memory.js "search query" --limit=5
 */

const { Pool } = require('pg');

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
    const dimensions = 1536;
    return Array.from({ length: dimensions }, () => (Math.random() * 2 - 1));
}

async function searchMemories(query, options = {}) {
    const pool = new Pool(PG_CONFIG);
    const limit = options.limit || 5;
    
    try {
        const embedding = await getEmbedding(query);
        
        const result = await pool.query(
            `SELECT id, content, source_file, created_at, tags, agent_id,
                    1 - (embedding <=> $1::vector) as similarity
             FROM memory_entries
             ORDER BY embedding <=> $1::vector
             LIMIT $2`,
            [`[${embedding.join(',')}]`, limit]
        );
        
        // Log the search
        await pool.query(
            `INSERT INTO memory_lookups (query, results) VALUES ($1, $2)`,
            [query, JSON.stringify(result.rows)]
        );
        
        return result.rows;
    } catch (err) {
        console.error('Error searching memories:', err.message);
        throw err;
    } finally {
        await pool.end();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const query = args.find(a => !a.startsWith('--'));
    
    if (!query) {
        console.log('Usage: node search-memory.js "search query" --limit=5');
        process.exit(1);
    }
    
    const options = {
        limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 5
    };
    
    searchMemories(query, options)
        .then(results => {
            console.log(`\nFound ${results.length} results:\n`);
            results.forEach((r, i) => {
                console.log(`${i + 1}. [${(r.similarity * 100).toFixed(1)}%] ${r.content.substring(0, 100)}...`);
                console.log(`   Source: ${r.source_file || 'unknown'} | Agent: ${r.agent_id || 'unknown'}`);
                console.log();
            });
            process.exit(0);
        })
        .catch(() => process.exit(1));
}

module.exports = { searchMemories, getEmbedding };
