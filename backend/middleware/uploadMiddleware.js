const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'nominees');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

module.exports = upload;
