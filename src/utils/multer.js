import multer from 'multer';

const storage = multer.memoryStorage(); // store file buffer temporarily
const upload = multer({ storage });

export default upload;
