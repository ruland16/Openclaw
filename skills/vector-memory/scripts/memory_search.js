#!/usr/bin/env node
/**
 * Memory Search Script (Node.js version matching Python API)
 * Semantic search through stored memories
 * 
 * Usage: node memory_search.js "search query" --limit=5 --category="daily-note" --min-score=0.3
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

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = 'gemini-embedding-001';

async function getEmbedding(text) {
    if (!GEMINI_KEY) {
        throw new Error('GEMINI_API_KEY environment variable not set');
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_KEY}`;
    const payload = JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: 768
    });
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    });
    
    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.embedding.values;
}

async function searchMemories(query, options = {}) {
    const pool = new Pool(PG_CONFIG);
    const limit = options.limit || 5;
    const minScore = options.minScore || 0.0;
    
    try {
        const embedding = await getEmbedding(query);
        const vecStr = '[' + embedding.join(',') + ']';
        
        let sql = `SELECT id, text, label, category, source, created_at, 
                   1-(embedding<=>$1::vector) as similarity 
                   FROM memories`;
        const params = [vecStr];
        
        if (options.category) {
            sql += ' WHERE category=$2';
            params.push(options.category);
        }
        
        sql += ' ORDER BY embedding<=>$1::vector LIMIT $' + (params.length + 1);
        params.push(limit);
        
        const result = await pool.query(sql, params);
        
        const results = result.rows
            .filter(r => parseFloat(r.similarity) >= minScore)
            .map(r => ({
                id: r.id,
                text: r.text,
                label: r.label,
                category: r.category,
                source: r.source,
                created_at: r.created_at.toISOString(),
                similarity: Math.round(parseFloat(r.similarity) * 10000) / 10000
            }));
        
        console.log(JSON.stringify({
            query,
            count: results.length,
            results
        }, null, 2));
        
        return results;
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
    
    const getArg = (name) => {
        const arg = args.find(a => a.startsWith(`--${name}=`));
        return arg ? arg.split('=')[1] : null;
    };
    
    if (!query) {
        console.log('Usage: node memory_search.js "search query" --limit=5 --category="daily-note" --min-score=0.3');
        process.exit(1);
    }
    
    const options = {
        limit: parseInt(getArg('limit')) || 5,
        category: getArg('category'),
        minScore: parseFloat(getArg('min-score')) || 0.0
    };
    
    searchMemories(query, options)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { searchMemories, getEmbedding };
