import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
