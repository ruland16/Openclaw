#!/usr/bin/env node
/**
 * Memory Store Script (Node.js version matching Python API)
 * Stores memories with Gemini embeddings
 * 
 * Usage: node memory_store.js "memory content" --label="Section" --category="daily-note" --source="conversation"
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

async function storeMemory(text, options = {}) {
    const pool = new Pool(PG_CONFIG);
    
    try {
        const embedding = await getEmbedding(text);
        const vecStr = '[' + embedding.join(',') + ']';
        
        const result = await pool.query(
            `INSERT INTO memories (text, label, category, source, embedding, metadata)
             VALUES ($1, $2, $3, $4, $5::vector, $6)
             RETURNING id, created_at`,
            [
                text,
                options.label || null,
                options.category || null,
                options.source || 'conversation',
                vecStr,
                JSON.stringify(options.metadata || {})
            ]
        );
        
        const row = result.rows[0];
        console.log(JSON.stringify({
            id: row.id,
            created_at: row.created_at,
            label: options.label,
            category: options.category,
            text: text.substring(0, 100)
        }, null, 2));
        
        return row.id;
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
    
    // Parse arguments
    const text = args.find(a => !a.startsWith('--'));
    const getArg = (name) => {
        const arg = args.find(a => a.startsWith(`--${name}=`));
        return arg ? arg.split('=')[1] : null;
    };
    
    if (!text) {
        console.log('Usage: node memory_store.js "memory content" --label="Section" --category="daily-note" --source="conversation" --meta=\'{"key":"value"}\'');
        process.exit(1);
    }
    
    const options = {
        label: getArg('label'),
        category: getArg('category'),
        source: getArg('source') || 'conversation',
        metadata: getArg('meta') ? JSON.parse(getArg('meta')) : {}
    };
    
    storeMemory(text, options)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { storeMemory, getEmbedding };
