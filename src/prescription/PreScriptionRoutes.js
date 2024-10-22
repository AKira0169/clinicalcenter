const express = require('express');
const authenticationController = require('../../Middleware/authenticationController');

const PreScriptionController = require('./PreScriptionController');

const router = express.Router();
const protectAdminRoutes = [authenticationController.protect, authenticationController.restrictTo('admin')];

router.use(protectAdminRoutes);

router.post('/createPreScription', PreScriptionController.createPreScription);

module.exports = router;
