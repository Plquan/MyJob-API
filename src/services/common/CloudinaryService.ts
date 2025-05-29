import cloudinary from '@/ultils/Cloudinary';
import DatabaseService from './DatabaseService';
import { MyJobFile } from '@/entity/MyJobFile';

export class CloudinaryService {
  private readonly _context: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this._context = databaseService;
  }

  async uploadImage(filePath: string, userId: number, fileType: string): Promise<MyJobFile> {
    try {
      const uploadResponse = await cloudinary.uploader.upload(filePath, {
        folder: 'myjob',
      });

      const newFile = new MyJobFile();
      newFile.userId = userId;
      newFile.url = uploadResponse.secure_url;
      newFile.fileType = fileType;

      return await this._context.MyJobFileRepo.save(newFile);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }
}

export default CloudinaryService;
