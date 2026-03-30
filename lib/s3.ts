import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.S3_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
});

export async function uploadToS3(buffer: Buffer, filename: string, contentType: string) {
    const bucketName = process.env.S3_BUCKET_NAME || "butterfly-couture-assets";
    console.log(`[S3] Uploading ${filename} to bucket: ${bucketName}`);
    
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: `uploads/${filename}`,
            Body: buffer,
            ContentType: contentType,
        });

        await s3Client.send(command);
    } catch (error) {
        console.error(`[S3] Upload failed for ${filename}:`, error);
        throw error;
    }

    // Construct the public URL
    // Note: This assumes the bucket/object is public or you are using a CDN
    return `https://${bucketName}.s3.${process.env.S3_REGION || 'ap-south-1'}.amazonaws.com/uploads/${filename}`;
}
