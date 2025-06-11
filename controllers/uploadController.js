const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const uploadFiles = (req, res) => {
  const file = req.file;
  console.log(req.file)
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const uploadedFile = {
    url: file.path,
    name: file.originalname,
    size: file.size,
  };
  res.status(200).json(uploadedFile);
};

module.exports = { upload, uploadFiles };
