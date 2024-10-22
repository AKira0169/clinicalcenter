const express = require('express');
const inventoryController = require('./inventoryController');
const authenticationController = require('../../Middleware/authenticationController');
const { upload } = require('../../config/multerConfig');
const { processAndUploadImages } = require('../../Middleware/upLoadImage');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
router.use(protectRoutes);
router.post('/', upload.single('item'), processAndUploadImages('item'), inventoryController.createItem);
router.get('/', inventoryController.getAllItems);
router.patch('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);

module.exports = router;
