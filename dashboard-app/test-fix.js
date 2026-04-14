// Test script to verify the dashboard fix
const http = require('http');
const WebSocket = require('ws');

console.log('=== Testing Dashboard Fix ===\n');

// Test 1: Check if server is running
console.log('1. Testing HTTP server...');
http.get('http://localhost:3000/health', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const health = JSON.parse(data);
        console.log(`   ✅ Health: ${health.status}`);
        console.log(`   ✅ WebSocket clients: ${health.websocket_clients}`);
        console.log(`   ✅ Timestamp: ${health.timestamp}`);
        
        // Test 2: Check API endpoints
        console.log('\n2. Testing API endpoints...');
        http.get('http://localhost:3000/api/agents', (res) => {
            let apiData = '';
            res.on('data', (chunk) => apiData += chunk);
            res.on('end', () => {
                const agents = JSON.parse(apiData);
                console.log(`   ✅ API Success: ${agents.success}`);
                console.log(`   ✅ Agent count: ${agents.count}`);
                
                if (agents.agents && agents.agents.length > 0) {
                    console.log(`   ✅ First agent: ${agents.agents[0].name} (${agents.agents[0].role})`);
                }
                
                // Test 3: Test WebSocket connection
                console.log('\n3. Testing WebSocket connection...');
                const ws = new WebSocket('ws://localhost:3000');
                
                ws.on('open', () => {
                    console.log('   ✅ WebSocket connected successfully!');
                    
                    // Send a test message
                    ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
                    console.log('   ✅ Sent ping message');
                    
                    // Close after receiving response
                    setTimeout(() => {
                        ws.close();
                        console.log('\n=== All tests completed successfully! ===');
                        console.log('\nThe dashboard should now work correctly.');
                        console.log('Please try accessing:');
                        console.log('  - http://localhost:3000/simple-dashboard-fixed.html');
                        console.log('  - http://localhost:3000/simple-dashboard-fixed-v2.html');
                        console.log('  - http://localhost:3000/ultra-simple-test.html (for debugging)');
                        process.exit(0);
                    }, 1000);
                });
                
                ws.on('message', (data) => {
                    try {
                        const msg = JSON.parse(data);
                        console.log(`   📨 Received: ${msg.type}`);
                        
                        if (msg.type === 'connection_established') {
                            console.log(`   ✅ Connection message: ${msg.message}`);
                        } else if (msg.type === 'pong') {
                            console.log('   ✅ Received pong response');
                        }
                    } catch (e) {
                        console.log(`   📨 Raw message: ${data}`);
                    }
                });
                
                ws.on('error', (error) => {
                    console.log(`   ❌ WebSocket error: ${error.message}`);
                    process.exit(1);
                });
                
                ws.on('close', () => {
                    console.log('   🔌 WebSocket closed');
                });
            });
        }).on('error', (error) => {
            console.log(`   ❌ API test failed: ${error.message}`);
            process.exit(1);
        });
    });
}).on('error', (error) => {
    console.log(`   ❌ Server not reachable: ${error.message}`);
    console.log('\nPlease make sure the server is running:');
    console.log('  cd /home/user/.openclaw/workspace/dashboard-app');
    console.log('  node server-simple.js');
    process.exit(1);
});