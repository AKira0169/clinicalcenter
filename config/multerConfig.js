const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Set a limit on the file size, e.g., 50MB
  },
  onError: (error, req, res, next) => {
    console.error('Error uploading file:', error.message || error);
    res.status(500).json({ status: 'Error', message: error.message || 'Something went wrong' });
  },
});

module.exports = { upload };
