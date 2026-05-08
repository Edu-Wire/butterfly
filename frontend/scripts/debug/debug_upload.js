const fs = require('fs');
const path = require('path');
const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const filename = 'test-upload-debug.txt';
const fileContent = 'Start';

// Construct multipart payload manually (though your API supports raw binary too)
// Let's use raw binary for simplicity since I modified the API to support it.
// Wait, the API supports raw binary if Content-Type starts with image/.

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'image/jpeg', // Fake mime type to trigger logic
        'x-filename': 'test-upload-debug.jpg'
    }
};

console.log('Sending upload request...');

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response body:', data);

        // Now verify if file exists
        const publicUploads = path.join(process.cwd(), 'public', 'uploads');
        const expectedFile = 'test-upload-debug.jpg';
        // Note: API might rename it to .jpg if I send .txt, but I sent .jpg name.

        // Check for the file (API might prepend timestamp or change name)
        try {
            const json = JSON.parse(data);
            if (json.url) {
                const uploadedFilename = path.basename(json.url);
                const localPath = path.join(publicUploads, uploadedFilename);
                console.log(`Checking for file at: ${localPath}`);
                if (fs.existsSync(localPath)) {
                    console.log('✅ File found!');
                } else {
                    console.log('❌ File NOT found at expected path.');

                    // List directory to see what IS there
                    console.log(`Listing ${publicUploads}:`);
                    if (fs.existsSync(publicUploads)) {
                        fs.readdirSync(publicUploads).forEach(file => {
                            console.log(' - ' + file);
                        });
                    } else {
                        console.log('Directory does not exist.');
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });
});

req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
});

// Write "image" data (just text for test, squoosh handles buffers)
// Squoosh might fail on text content, but the fallback should write it anyway
req.write(Buffer.from('Fake image content'));
req.end();
