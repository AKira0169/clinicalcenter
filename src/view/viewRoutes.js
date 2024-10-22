const express = require('express');
const viewController = require('./viewController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

router.get('/Booking', viewController.bookingPage);
router.get('/booked', viewController.bookedPage);
router.get('/Queue', viewController.queuePage);
router.get('/Patient', viewController.patientPage);

module.exports = router;
