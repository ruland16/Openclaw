#!/usr/bin/env node
/**
 * Memory Flush Script (Node.js version matching Python API)
 * Flushes daily memory files into vector database
 * 
 * Usage: node memory_flush.js [--dry-run] [--force]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

// Config
const PG_CONFIG = {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'openclaw_memory',
    user: process.env.PGUSER || 'openclaw',
    password: process.env.PGPASSWORD || '',
};

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const FLUSH_TRACKER = path.join(MEMORY_DIR, 'vector-flush-tracker.json');
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

function loadTracker() {
    if (fs.existsSync(FLUSH_TRACKER)) {
        return JSON.parse(fs.readFileSync(FLUSH_TRACKER, 'utf-8'));
    }
    return { flushed_files: {} };
}

function saveTracker(tracker) {
    fs.writeFileSync(FLUSH_TRACKER, JSON.stringify(tracker, null, 2));
}

function fileHash(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    return crypto.createHash('md5').update(content).digest('hex');
}

function chunkMarkdown(text, sourceFile) {
    const chunks = [];
    const lines = text.split('\n');
    let currentSection = '';
    let currentText = [];
    
    for (const line of lines) {
        if (/^#{1,3}\s/.test(line)) {
            if (currentText.length > 0) {
                const content = currentText.join('\n').trim();
                if (content.length > 20) {
                    chunks.push({
                        text: content,
                        label: currentSection.replace(/^#+\s*/, '').trim(),
                        source_file: sourceFile
                    });
                }
            }
            currentSection = line;
            currentText = [line];
        } else {
            currentText.push(line);
        }
    }
    
    if (currentText.length > 0) {
        const content = currentText.join('\n').trim();
        if (content.length > 20) {
            chunks.push({
                text: content,
                label: currentSection.replace(/^#+\s*/, '').trim(),
                source_file: sourceFile
            });
        }
    }
    
    return chunks;
}

async function flush(dryRun = false, force = false) {
    const tracker = loadTracker();
    const pool = dryRun ? null : new Pool(PG_CONFIG);
    
    const files = fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(MEMORY_DIR, f));
    
    const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
    if (fs.existsSync(memoryMd)) {
        files.push(memoryMd);
    }
    
    let totalStored = 0;
    
    for (const filepath of files) {
        const fname = path.basename(filepath);
        const fhash = fileHash(filepath);
        
        if (!force && tracker.flushed_files[fname] === fhash) {
            continue;
        }
        
        const content = fs.readFileSync(filepath, 'utf-8');
        const chunks = chunkMarkdown(content, fname);
        
        if (dryRun) {
            console.log(`[DRY RUN] ${fname}: ${chunks.length} chunks`);
            continue;
        }
        
        // Delete existing entries for this file
        await pool.query(
            "DELETE FROM memories WHERE metadata->>'source_file' = $1",
            [fname]
        );
        
        for (const chunk of chunks) {
            const embedding = await getEmbedding(chunk.text);
            const vecStr = '[' + embedding.join(',') + ']';
            
            await pool.query(
                `INSERT INTO memories (text, label, category, source, embedding, metadata)
                 VALUES ($1, $2, $3, $4, $5::vector, $6)`,
                [
                    chunk.text,
                    chunk.label,
                    'daily-note',
                    'flush',
                    vecStr,
                    JSON.stringify({ source_file: fname })
                ]
            );
            totalStored++;
        }
        
        tracker.flushed_files[fname] = fhash;
        console.log(`[FLUSHED] ${fname}: ${chunks.length} chunks stored`);
    }
    
    if (pool) await pool.end();
    saveTracker(tracker);
    
    console.log(JSON.stringify({ total_stored: totalStored, files_processed: files.length }));
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const force = args.includes('--force');
    
    flush(dryRun, force)
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Flush failed:', err.message);
            process.exit(1);
        });
}

module.exports = { flush, chunkMarkdown, fileHash };
