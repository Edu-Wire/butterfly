
import dotenv from 'dotenv';
dotenv.config();

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_API_URL = 'https://api.fashn.ai/v1';

async function test() {
    process.stdout.write('Using API Key: ' + FASHN_API_KEY + '\n');

    const params = {
        model_image: 'https://res.cloudinary.com/dgpm72swx/image/upload/v1771832551/butterfly-couture/try-on/fkpj2k86batpix0pgnbx.png',
        garment_image: 'https://res.cloudinary.com/dgpm72swx/image/upload/v1771568620/butterfly-couture/1771568619318-blob.jpg',
        category: 'dresses',
        restore_background: true,
        restore_details: true,
        adjust_hands: true
    };

    try {
        const response = await fetch(`${FASHN_API_URL}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FASHN_API_KEY}`,
            },
            body: JSON.stringify(params),
        });

        const text = await response.text();
        console.log('--- TEST RESULTS ---');
        console.log('Status:', response.status);
        console.log('Raw Response:', text);
        try {
            const data = JSON.parse(text);
            console.log('Parsed JSON:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('Response is not JSON');
        }
        console.log('--- END TEST ---');
    } catch (err) {
        console.error('Test Error:', err);
    }
}

test();
