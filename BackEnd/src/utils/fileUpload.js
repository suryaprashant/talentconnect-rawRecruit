import cloudinary from '../../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary storage for documents
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-documents',
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip'],
    resource_type: 'raw', // Important for non-image files
  },
});

// Create multer upload instance
export const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to delete file from Cloudinary
export const deleteDocument = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    return true;
  } catch (error) {
    console.error('Error deleting document from Cloudinary:', error);
    return false;
  }
};
