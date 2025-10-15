export const FileType = {
  LOGO: 'LOGO',
  COVER_IMAGE: 'COVER_IMAGE',
  COMPANY_IMAGE: 'COMPANY_IMAGE',
  AVATAR: 'AVATAR',
  CV_UPLOAD: 'CV_UPLOAD',
} as const;
export type FileType = typeof FileType[keyof typeof FileType];