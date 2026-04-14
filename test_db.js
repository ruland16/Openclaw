// Simple test script
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'mission_control.db');

console.log('Testing database creation...');

// Remove existing database if it exists
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Removed existing database');
}

// Create new database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
        process.exit(1);
    }
    console.log('Database created successfully');
    
    // Create a simple table
    db.run(`
        CREATE TABLE IF NOT EXISTS test_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            db.close();
            process.exit(1);
        }
        console.log('Test table created');
        
        // Insert test data
        db.run('INSERT INTO test_table (name) VALUES (?)', ['Test Agent'], function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                db.close();
                process.exit(1);
            }
            console.log('Test data inserted, ID:', this.lastID);
            
            // Query data
            db.all('SELECT * FROM test_table', (err, rows) => {
                if (err) {
                    console.error('Error querying data:', err.message);
                    db.close();
                    process.exit(1);
                }
                console.log('Query results:', rows);
                
                // Close database
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                        process.exit(1);
                    }
                    console.log('Database closed successfully');
                    console.log('✅ Database test PASSED!');
                    process.exit(0);
                });
            });
        });
    });
});