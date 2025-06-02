const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Create upload directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); 
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the folder based on file type
    let uploadPath = "uploads/image";
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, 
});

module.exports = upload;
