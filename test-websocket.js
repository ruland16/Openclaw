const WebSocket = require('ws');

console.log('Testing WebSocket connection to ws://localhost:3000');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
    console.log('✅ WebSocket connection established');
    
    // Send a test message
    ws.send(JSON.stringify({
        type: 'test',
        message: 'Hello from Node.js client'
    }));
});

ws.on('message', function message(data) {
    console.log('📨 Received:', data.toString());
});

ws.on('close', function close() {
    console.log('❌ WebSocket connection closed');
});

ws.on('error', function error(err) {
    console.log('❌ WebSocket error:', err.message);
});

// Close after 5 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 5000);