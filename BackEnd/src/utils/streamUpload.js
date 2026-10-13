
import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";

export const streamUpload = (buffer, folder, mimetype = "") => {
  return new Promise((resolve, reject) => {
    const isPdf = mimetype === "application/pdf";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `rawrecruit/${folder}`,
        resource_type: isPdf ? "raw" : "image", // 🔥 FIX
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/*import streamifier from 'streamifier';
import cloudinary from '../../config/cloudinary.js';


 export  const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: `rawrecruit/${folder}` },
    (error, result) => {
        if (error) {
         
          console.error("Cloudinary Upload Error:", error);
          return reject(error); // Use return to stop execution here.
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};*/


// import streamifier from 'streamifier';
// import cloudinary from '../../config/cloudinary.js';

// export const streamUpload = (buffer, folder, originalName = '') => {
//   return new Promise((resolve, reject) => {
//     // Determine resource type based on file extension
//     const getResourceType = (filename) => {
//       if (!filename) return 'auto';
//       const ext = filename.split('.').pop().toLowerCase();
//       const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
//       const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      
//       if (documentExtensions.includes(ext)) return 'raw';
//       if (imageExtensions.includes(ext)) return 'image';
//       return 'auto';
//     };

//     const resourceType = getResourceType(originalName);

//     const uploadOptions = {
//       resource_type: resourceType,
//       folder: `rawrecruit/${folder}`,
//       access_mode: 'public',
//       // Add quality optimization for images
//       quality: resourceType === 'image' ? 'auto:good' : undefined,
//       // For documents, preserve original format
//       format: resourceType === 'raw' ? undefined : 'auto',
//     };

//     const stream = cloudinary.uploader.upload_stream(
//       uploadOptions,
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Upload Error:", error);
//           console.error("Error details:", error.message);
//           return reject(error);
//         }
//         console.log(`Upload successful - Type: ${resourceType}, URL: ${result.secure_url}`);
//         resolve(result);
//       }
//     );
    
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };