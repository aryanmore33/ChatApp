const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('env')
const fs = require('fs');
const { resourceLimits } = require('worker_threads');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SERCRET,
});

const uploadToCloudinary = (file) => {
    const options = {
        resource_type : file.mimetype.startWith('video') ? 'video' : 'image'
        
    }
}