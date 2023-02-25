import multer from 'multer';
const maxSize = 1024 * 1024 * 10; // 10 mb
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxSize } });

export default upload;
