const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Vercel's filesystem is read-only except the OS temp folder — and even
// that isn't shared or kept between requests. So on Vercel we point uploads
// at a temp folder (so the app doesn't crash on startup); locally / on a
// traditional host it uses the real uploads folder.
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads', 'nominees')
  : path.join(__dirname, '..', 'uploads', 'nominees');

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
