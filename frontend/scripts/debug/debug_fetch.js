const http = require('http');

console.log('Fetching /api/categories...');
http.get('http://localhost:3000/api/categories', (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => console.log('Response:', data));
}).on('error', (e) => console.error(`Got error: ${e.message}`));
