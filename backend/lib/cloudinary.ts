import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer: Buffer, filename: string, contentType: string) {
    const isVideo = contentType.startsWith('video/');

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: isVideo ? 'video' : 'auto',
                folder: 'butterfly-couture',
                public_id: filename.split('.')[0],
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result?.secure_url);
                }
            }
        );

        uploadStream.end(buffer);
    });
}

export async function uploadLargeToCloudinary(filePath: string, filename: string) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            {
                resource_type: 'video',
                folder: 'butterfly-couture',
                public_id: filename.split('.')[0],
                chunk_size: 6000000, // 6MB chunks for reliability
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary large upload error:', error);
                    reject(error);
                } else {
                    resolve(result?.secure_url);
                }
            }
        );
    });
}

export default cloudinary;
