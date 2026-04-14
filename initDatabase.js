#!/usr/bin/env node

/**
 * Mission Control Dashboard - Database Initialization Script
 * Creates and initializes SQLite database with schema and sample data
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'mission_control.db');
const SCHEMA_PATH = path.join(__dirname, 'init_database.sql');

console.log('🚀 Initializing Mission Control Dashboard Database...');
console.log(`Database path: ${DB_PATH}`);

// Check if database already exists
const dbExists = fs.existsSync(DB_PATH);
if (dbExists) {
    console.log('⚠️  Database already exists. Creating backup...');
    const backupPath = `${DB_PATH}.backup.${Date.now()}`;
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`Backup created: ${backupPath}`);
}

// Create or open database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Read and execute schema SQL
fs.readFile(SCHEMA_PATH, 'utf8', (err, sql) => {
    if (err) {
        console.error('❌ Error reading schema file:', err.message);
        db.close();
        process.exit(1);
    }

    console.log('📋 Executing schema creation...');
    
    // Split SQL by semicolons (simple approach)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    let completed = 0;
    let errors = 0;
    
    statements.forEach((statement, index) => {
        db.run(statement + ';', (err) => {
            if (err) {
                console.error(`❌ Error executing statement ${index + 1}:`, err.message);
                errors++;
            } else {
                completed++;
            }
            
            // Check if all statements are done
            if (completed + errors === statements.length) {
                if (errors === 0) {
                    console.log(`✅ Successfully executed ${completed} SQL statements`);
                    
                    // Verify database was created properly
                    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
                        if (err) {
                            console.error('❌ Error verifying tables:', err.message);
                        } else {
                            console.log(`📊 Created ${tables.length} tables:`);
                            tables.forEach(table => console.log(`  - ${table.name}`));
                            
                            // Show some sample data
                            console.log('\n👥 Sample agent data:');
                            db.all("SELECT name, role, status FROM agents ORDER BY id", (err, agents) => {
                                if (err) {
                                    console.error('❌ Error fetching agents:', err.message);
                                } else {
                                    agents.forEach(agent => {
                                        console.log(`  - ${agent.name} (${agent.role}): ${agent.status}`);
                                    });
                                }
                                
                                console.log('\n✅ Database initialization complete!');
                                console.log(`📁 Database file: ${DB_PATH}`);
                                console.log(`📄 Schema file: ${SCHEMA_PATH}`);
                                
                                db.close((err) => {
                                    if (err) {
                                        console.error('❌ Error closing database:', err.message);
                                        process.exit(1);
                                    }
                                    console.log('🔒 Database connection closed');
                                    process.exit(0);
                                });
                            });
                        }
                    });
                } else {
                    console.error(`❌ Database initialization failed with ${errors} errors`);
                    db.close();
                    process.exit(1);
                }
            }
        });
    });
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, closing database...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        process.exit(0);
    });
});