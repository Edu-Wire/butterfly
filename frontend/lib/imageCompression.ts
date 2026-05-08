import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.8,
};

export async function compressImage(
  file: File,
  options: CompressionOptions = defaultCompressionOptions
): Promise<File> {
  try {
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2) + ' MB');
    
    const compressedFile = await imageCompression(file, options);
    
    console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2) + ' MB');
    console.log('Compression ratio:', ((file.size - compressedFile.size) / file.size * 100).toFixed(2) + '%');
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

export async function compressMultipleImages(
  files: File[],
  options: CompressionOptions = defaultCompressionOptions
): Promise<File[]> {
  const compressedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // Return original file if compression fails
      compressedFiles.push(file);
    }
  }
  
  return compressedFiles;
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
