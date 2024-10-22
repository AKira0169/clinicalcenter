const express = require('express');
const multer = require('multer');

const preSetController = require('./preSetController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
router.use(protectRoutes);
const upload = multer();

router.post('/', upload.none(), preSetController.createPreSet);
router.delete('/:id', preSetController.deletepreSet);
router.patch('/:id', preSetController.updatepreSet);

module.exports = router;
