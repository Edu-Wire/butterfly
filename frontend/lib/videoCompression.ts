import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';

const execPromise = promisify(exec);

export async function compressVideo(inputBuffer: Buffer, filename: string): Promise<{ buffer: Buffer, filename: string, outputPath: string }> {
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}-${filename}`);
    const outputPath = path.join(tempDir, `output-${Date.now()}-${path.parse(filename).name}.mp4`);

    try {
        let actualFfmpegPath = ffmpegPath;
        if (actualFfmpegPath && actualFfmpegPath.startsWith('\\ROOT')) {
            actualFfmpegPath = path.join(process.cwd(), actualFfmpegPath.replace('\\ROOT\\butterfly-couture\\', ''));
        }

        if (!actualFfmpegPath) {
            throw new Error('FFmpeg path not found');
        }

        // Force absolute path for safe execution
        const absoluteFfmpegPath = path.isAbsolute(actualFfmpegPath) ? actualFfmpegPath : path.resolve(process.cwd(), actualFfmpegPath);

        // Write buffer to temp file
        await fs.promises.writeFile(inputPath, inputBuffer);

        // FFmpeg command using libx264 for speed and mp4 for compatibility
        // -t 15: Trims to first 15 seconds
        // -preset fast for speed, -crf 23 for decent quality/size balance
        const command = `"${absoluteFfmpegPath}" -i "${inputPath}" -t 15 -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;

        console.log(`[VideoCompression] Running command: ${command}`);
        const { stdout, stderr } = await execPromise(command);
        if (stderr) console.log(`[VideoCompression] FFmpeg output: ${stderr}`);

        // Read the compressed file
        const outputBuffer = await fs.promises.readFile(outputPath);

        return {
            buffer: outputBuffer,
            filename: `${path.parse(filename).name}.mp4`,
            outputPath: outputPath
        };
    } catch (error) {
        console.error('[VideoCompression] Error during compression:', error);
        throw error;
    } finally {
        // Clean up input file
        if (fs.existsSync(inputPath)) {
            await fs.promises.unlink(inputPath).catch(() => { });
        }
    }
}
