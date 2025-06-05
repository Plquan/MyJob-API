import cloudinary from '@/ultils/Cloudinary';
import { v4 as uuidv4 } from 'uuid';
import streamifier from 'streamifier';
import type { UploadApiResponse } from 'cloudinary';

export class CloudinaryService {
  static async uploadImage(
    file: Express.Multer.File,
    folder: string,
    publicId?: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId || uuidv4(),
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error);
            return reject(error);
          }
          return resolve(result as UploadApiResponse);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  static async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('[Cloudinary Delete Error]', error);
          return reject(error);
        }
        if (result.result !== 'ok') {
          return reject(new Error(`Delete failed: ${result.result}`));
        }
        resolve();
      });
    });
  }
}

export default CloudinaryService;

