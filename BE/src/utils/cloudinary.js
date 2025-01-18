const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Lấy từ môi trường
  api_key: process.env.API_KEY_CLOUDINARY, // Lấy từ môi trường
  api_secret: process.env.API_SECRET_CLOUDINARY, // Lấy từ môi trường
});

module.exports = cloudinary;
