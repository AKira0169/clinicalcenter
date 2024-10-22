const express = require('express');
const videoController = require('./videoController');
const { upload } = require('../../config/multerConfig');
const { processAndUploadVideo } = require('../../Middleware/UploadVideos');

const router = express.Router();
// processAndUploadVideo('videos'),
router.route('/upload').post(upload.single('video'), processAndUploadVideo('videos'), videoController.uploadVideo);

router.route('/delete/:id').delete(videoController.deleteVideo);

module.exports = router;
