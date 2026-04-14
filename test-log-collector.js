#!/usr/bin/env node

/**
 * Test script for Log Collector Service
 */

const LogCollector = require('./log-collector');

console.log('=== Testing Log Collector Service ===\n');

// Create collector with smaller buffer for testing
const collector = new LogCollector({
  bufferSize: 10,
  flushInterval: 10000, // 10 seconds for testing
  logDirectory: './test-logs'
});

// Start collector
collector.start();

// Test 1: Log some activities
console.log('Test 1: Logging activities...');
const activityIds = [];

for (let i = 0; i < 5; i++) {
  const id = collector.logActivity({
    agent_id: 'test-agent',
    agent_name: 'Test Agent',
    activity_type: 'test',
    activity_data: {
      message: `Test activity ${i + 1}`,
      iteration: i + 1
    },
    priority: 1
  });
  activityIds.push(id);
  console.log(`  Logged activity ${i + 1}: ${id}`);
}

// Test 2: Check stats
console.log('\nTest 2: Checking stats...');
const stats = collector.getStats();
console.log('  Buffer size:', stats.bufferSize);
console.log('  Max buffer:', stats.maxBufferSize);
console.log('  Is collecting:', stats.isCollecting);

// Test 3: Search in buffer
console.log('\nTest 3: Searching activities...');
const results = collector.searchInBuffer('test', { agent_id: 'test-agent' });
console.log(`  Found ${results.length} activities matching "test"`);

// Test 4: Force flush
console.log('\nTest 4: Testing buffer flush...');
console.log('  Waiting for flush interval (10 seconds)...');

// Wait for flush
setTimeout(() => {
  const statsAfterFlush = collector.getStats();
  console.log('  Buffer after flush:', statsAfterFlush.bufferSize);
  console.log('  Log files count:', statsAfterFlush.filesInDirectory);
  
  // Test 5: Shutdown
  console.log('\nTest 5: Testing shutdown...');
  collector.shutdown();
  
  console.log('\n=== All tests completed ===');
  console.log('Check ./test-logs directory for generated log files');
  
  // Cleanup: Remove test directory
  const fs = require('fs');
  const path = require('path');
  const testDir = path.join(__dirname, 'test-logs');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
    console.log('Cleaned up test directory');
  }
  
  process.exit(0);
}, 11000); // Slightly more than flush interval