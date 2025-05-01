import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class StorageService {
  private readonly MAX_IMAGE_SIZE = 1200;
  private readonly MAX_AUDIO_BITRATE = '128k';
  private readonly MAX_VIDEO_DURATION = 30; // seconds
  private readonly MAX_VIDEO_WIDTH = 1280;
  private readonly MAX_VIDEO_HEIGHT = 720;
  private readonly VIDEO_BITRATE = '2000k';
  private readonly SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
  private readonly SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  private readonly UPLOAD_DIR = path.join(process.cwd(), 'uploads');

  constructor() {
    // Skapa uploads-mappen om den inte finns
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  /**
   * Process and optimize media files
   * @param buffer The file buffer
   * @param mimeType The file's MIME type
   * @returns Processed buffer
   */
  async processMedia(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      if (this.SUPPORTED_IMAGE_TYPES.includes(mimeType)) {
        return this.processImage(buffer, mimeType);
      } else if (this.SUPPORTED_AUDIO_TYPES.includes(mimeType)) {
        return this.processAudio(buffer, mimeType);
      } else if (this.SUPPORTED_VIDEO_TYPES.includes(mimeType)) {
        return this.processVideo(buffer, mimeType);
      }
      console.log(`Unsupported media type: ${mimeType}, storing as-is`);
      return buffer;
    } catch (error) {
      console.error(`Error processing media: ${error}`);
      return buffer;
    }
  }

  /**
   * Upload media to local storage
   * @param buffer The file buffer
   * @param filename The original filename
   * @param mimeType The file's MIME type
   * @returns URL of the uploaded file
   */
  async uploadMedia(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const extension = this.getFileExtension(mimeType);
      const uniqueFilename = `${timestamp}-${filename}.${extension}`;
      const filePath = path.join(this.UPLOAD_DIR, uniqueFilename);
      
      // Spara filen lokalt
      await fs.promises.writeFile(filePath, buffer);
      
      // Skapa en relativ URL som kan användas av frontend
      const url = `/uploads/${uniqueFilename}`;
      console.log(`Successfully saved media: ${uniqueFilename} to ${filePath}`);
      return url;
    } catch (error) {
      console.error(`Error saving media: ${error}`);
      throw error;
    }
  }

  private async processImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      if (metadata.width && metadata.width > this.MAX_IMAGE_SIZE) {
        return image
          .resize(this.MAX_IMAGE_SIZE, this.MAX_IMAGE_SIZE, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat('jpeg', { quality: 80 })
          .toBuffer();
      }
      
      return image.toBuffer();
    } catch (error) {
      console.error(`Error processing image: ${error}`);
      return buffer;
    }
  }

  private async processAudio(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      const inputPath = `temp-${Date.now()}-input${this.getFileExtension(mimeType)}`;
      const outputPath = `temp-${Date.now()}-output.mp3`;
      
      await fs.promises.writeFile(inputPath, buffer);
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .audioBitrate(this.MAX_AUDIO_BITRATE)
          .toFormat('mp3')
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });
      
      const processedBuffer = await fs.promises.readFile(outputPath);
      
      await Promise.all([
        fs.promises.unlink(inputPath),
        fs.promises.unlink(outputPath)
      ]);
      
      return processedBuffer;
    } catch (error) {
      console.error(`Error processing audio: ${error}`);
      return buffer;
    }
  }

  private async processVideo(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      const inputPath = `temp-${Date.now()}-input${this.getFileExtension(mimeType)}`;
      const outputPath = `temp-${Date.now()}-output.mp4`;
      
      await fs.promises.writeFile(inputPath, buffer);
      
      const duration = await this.getVideoDuration(inputPath);
      
      if (duration > this.MAX_VIDEO_DURATION) {
        throw new Error(`Video duration (${duration}s) exceeds maximum allowed duration (${this.MAX_VIDEO_DURATION}s)`);
      }
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .size(`${this.MAX_VIDEO_WIDTH}x?`)
          .aspect('16:9')
          .videoBitrate(this.VIDEO_BITRATE)
          .audioBitrate(this.MAX_AUDIO_BITRATE)
          .fps(30)
          .format('mp4')
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });
      
      const processedBuffer = await fs.promises.readFile(outputPath);
      
      await Promise.all([
        fs.promises.unlink(inputPath),
        fs.promises.unlink(outputPath)
      ]);
      
      return processedBuffer;
    } catch (error) {
      console.error(`Error processing video: ${error}`);
      throw error;
    }
  }

  private async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(metadata.format.duration || 0);
      });
    });
  }

  private getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/mp4': 'm4a',
      'video/mp4': 'mp4',
      'video/quicktime': 'mov',
      'video/x-msvideo': 'avi',
      'video/webm': 'webm'
    };
    
    return extensions[mimeType] || 'bin';
  }

  /**
   * Check if a file exists in the uploads directory
   * @param filename The filename to check
   * @returns True if the file exists, false otherwise
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.UPLOAD_DIR, filename);
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
} 