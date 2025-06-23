import cloudinary from '../../ultils/Cloudinary';
import streamifier from 'streamifier';
import type { UploadApiResponse } from 'cloudinary';
import { CloudinaryResourceType } from '@/constants/CloudinaryResourceType';
import { v4 as uuidv4 } from 'uuid';

export class CloudinaryService {
  static async uploadFile(
    file:Express.Multer.File,
    folder: string,
    resourceType: CloudinaryResourceType,
    publicId?: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const format = file.originalname?.split('.').pop()?.toLowerCase()
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format,
          public_id: publicId,
          overwrite:true,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error('Lỗi tải tệp lên cloudinary', error);
            return reject(error);
          }
          return resolve(result as UploadApiResponse);
        }
      )
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  static async deleteFile(publicId: string,resourceType:string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId,  { resource_type: resourceType }, (error, result) => {
        if (error) {
          console.error('Xóa ảnh cloudinary bị lỗi', error)
          return reject(error)
        }
        if (result.result !== 'ok') {
          return reject(new Error(`Xóa thất bại: ${result.result}`))
        }
        resolve()
      })
    })
  }
}

export default CloudinaryService;

