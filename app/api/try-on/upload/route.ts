import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { uploadToS3 } from '@/lib/s3';

// Increase Next.js route timeout
export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const storageStrategy = process.env.IMAGE_STORAGE || 'cloudinary';

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Check file size - cap at 40MB
        if (file.size > 40 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Image too large. Please use an image under 40MB.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;

        let url: string = '';

        if (storageStrategy === 's3') {
            // Respect the S3 configuration
            url = await uploadToS3(buffer, filename, file.type);
        } else {
            // Fallback to Cloudinary but use the optimized stream upload
            const uploadResponse: any = await uploadToCloudinary(buffer, filename, file.type);
            url = typeof uploadResponse === 'string' ? uploadResponse : uploadResponse.secure_url;
        }

        return NextResponse.json({
            url: url,
        });
    } catch (error: any) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload image. Please try again.' },
            { status: 500 }
        );
    }
}
