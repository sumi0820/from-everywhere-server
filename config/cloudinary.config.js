const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Please add your details here
cloudinary.config({
  cloud_name: 'djct87vbj',
  api_key: '633446649512177',
  api_secret: '_XtIG9G1bLbHCY6Q4UOdFxZWPTw'
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'todo-gallery', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
  filename: function (req, res, cb) {
    cb(null, res.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

module.exports = multer({ storage })