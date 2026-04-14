const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'Connection': 'Upgrade',
    'Upgrade': 'websocket',
    'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
    'Sec-WebSocket-Version': '13'
  }
};

const req = http.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  res.on('data', (chunk) => {
    console.log('Response body:', chunk.toString());
  });
});

req.on('upgrade', (res, socket, head) => {
  console.log('✅ Upgrade received! WebSocket upgrade successful');
  socket.end();
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.end();