const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();

async function checkS3() {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION || "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || "",
            secretAccessKey: process.env.AWS_SECRET_KEY || "",
        },
    });

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = 'uploads/A7403540.JPG';

    console.log(`Checking S3 Bucket: ${bucketName}, Key: ${key}`);

    try {
        const command = new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        const res = await s3Client.send(command);
        console.log('--- File Found on S3 ---');
        console.log('Content-Type:', res.ContentType);
        console.log('Content-Length:', res.ContentLength);
    } catch (e) {
        console.error('--- File NOT found or accessed on S3 ---');
        console.error('Error:', e.message);
    }
}

checkS3();
