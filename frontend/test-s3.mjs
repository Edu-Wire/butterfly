import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';

const s3Client = new S3Client({
    region: process.env.S3_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
});

async function testS3() {
    console.log('Testing S3 upload...');
    console.log('Region:', process.env.S3_REGION);
    console.log('Bucket:', process.env.S3_BUCKET_NAME);
    
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `test-upload-${Date.now()}.txt`,
            Body: "Test connection",
            ContentType: "text/plain",
        });
        await s3Client.send(command);
        console.log('✅ S3 upload successful!');
    } catch (err) {
        console.error('❌ S3 upload failed:', err.message);
    }
}

testS3();
