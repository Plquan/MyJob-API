export function getFileCategory(file: Express.Multer.File): 'image' | 'pdf' | 'doc' | 'other' {
  const mimetype = file.mimetype;

  if (mimetype.startsWith('image/')) return 'image';

  if (mimetype === 'application/pdf') return 'pdf';

  if (
    mimetype === 'application/msword' || // .doc
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ) {
    return 'doc';
  }

  return 'other';
}
