
import fs from 'fs';
import 'dotenv/config';

const FASHN_API_KEY = process.env.FASHN_API_KEY;
const FASHN_API_URL = 'https://api.fashn.ai/v1';

async function test() {
    const params = {
        model_image: 'https://res.cloudinary.com/dgpm72swx/image/upload/v1771832551/butterfly-couture/try-on/fkpj2k86batpix0pgnbx.png',
        garment_image: 'https://res.cloudinary.com/dgpm72swx/image/upload/v1771568620/butterfly-couture/1771568619318-blob.jpg',
        category: 'one-pieces'
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
        fs.writeFileSync('fashn_test_result.txt', `Status: ${response.status}\nResponse: ${text}`);
    } catch (err) {
        fs.writeFileSync('fashn_test_result.txt', `Error: ${err.message}`);
    }
}

test();
