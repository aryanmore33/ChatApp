const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a signed upload config for client-side uploads
 */
const generateUploadSignature = (options = {}) => {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder: options.folder || 'whatsapp-clone',
  };

  if (options.public_id) {
    paramsToSign.public_id = options.public_id;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: paramsToSign.folder,
    public_id: options.public_id,
  };
};

module.exports = {
  generateUploadSignature,
};





// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// require('dotenv').config();
// const fs = require('fs');
// const { resourceLimits } = require('worker_threads');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SERCRET,
// });

// const uploadToCloudinary = (file) => {
//     const options = {
//         resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
//     }
//     return new Promise((resolve, reject) => {
//         const uploader = file.mimetype.startsWith('video') ? cloudinary.uploader.upload_large : cloudinary.uploader.upload;
//         uploader(file.path, options, (error, result) => {
//             fs.unlinkSync(file.path);
//             if (error) return reject(error);
//             resolve({result});
//         });
//     });
// }

// const multerMiddleware = multer({ dest: 'uploads/' }).single('media');  // Temporary storage in local machine before uploading to Cloudinary

// module.exports = {
//     uploadToCloudinary,
//     multerMiddleware
// }

