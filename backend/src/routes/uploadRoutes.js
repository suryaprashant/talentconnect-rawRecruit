// src/routes/uploadRoutes.js
import express from 'express';
import upload from '../utils/multer.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const router = express.Router();

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'rawrecruit' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await streamUpload(req.file.buffer);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
