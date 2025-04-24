// src/utils/upload.js
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder) => {
  return await cloudinary.v2.uploader.upload(file.path, {
    folder: `RawRecruit/${folder}`,
    resource_type: file.mimetype.includes('pdf') ? 'raw' : 'auto',
  });
};
