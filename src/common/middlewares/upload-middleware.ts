import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
   limits: { fileSize: 100 * 1024 * 1024 },
});


export const uploadFileMiddleware = upload.single('file');
export const uploadMultiFileMiddleware = upload.array('files');

