#!/usr/bin/env node
/**
 * Memory Sync Script
 * Syncs MEMORY.md and daily notes to vector database
 * 
 * Usage: node sync-memories.js
 */

const fs = require('fs');
const path = require('path');
const { storeMemory } = require('./store-memory');

const MEMORY_DIR = path.join(process.env.HOME, '.openclaw/workspace/agents/Lui/memory');

async function syncFile(filePath, options = {}) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split into chunks (paragraphs or sections)
    const chunks = content
        .split(/\n\n+/)
        .filter(c => c.trim().length > 50)  // Skip short fragments
        .map(c => c.trim());
    
    console.log(`Syncing ${chunks.length} chunks from ${path.basename(filePath)}...`);
    
    for (const chunk of chunks) {
        await storeMemory(chunk, {
            source: path.relative(process.env.HOME, filePath),
            agent: options.agent || 'lui',
            tags: options.tags || ['memory', 'sync']
        });
    }
    
    console.log(`✓ Synced ${path.basename(filePath)}`);
}

async function syncAll() {
    const files = fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(MEMORY_DIR, f));
    
    // Add MEMORY.md from parent directory
    const memoryMd = path.join(process.env.HOME, '.openclaw/workspace/agents/Lui/MEMORY.md');
    if (fs.existsSync(memoryMd)) {
        files.push(memoryMd);
    }
    
    console.log(`Found ${files.length} memory files to sync\n`);
    
    for (const file of files) {
        try {
            await syncFile(file);
        } catch (err) {
            console.error(`✗ Failed to sync ${path.basename(file)}:`, err.message);
        }
    }
    
    console.log('\n✓ Sync complete!');
}

// CLI usage
if (require.main === module) {
    syncAll()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Sync failed:', err);
            process.exit(1);
        });
}

module.exports = { syncFile, syncAll };
