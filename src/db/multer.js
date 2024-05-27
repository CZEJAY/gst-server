import multer from 'multer'

export const storage = multer.memoryStorage();
export const upload = multer({ storage });
