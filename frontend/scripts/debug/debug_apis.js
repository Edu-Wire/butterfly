const http = require('http');

function get(path, name) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- ${name} ---`);
            console.log('Status:', res.statusCode);
            try {
                const json = JSON.parse(data);
                console.log(JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Body:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request ${name}: ${e.message}`);
    });

    req.end();
}

console.log('Testing APIs...');
get('/api/collections', 'Collections API');
get('/api/categories', 'Categories API');
get('/api/brands', 'Brands API');
