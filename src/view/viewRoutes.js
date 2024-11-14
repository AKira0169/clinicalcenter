const express = require('express');
const viewController = require('./viewController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();
router.get('/login', viewController.loginPage);
router.use(authenticationController.isLoggedIn);
router.get('/', viewController.home);
router.get('/inventory', viewController.inventory);
router.get('/inventoryLogs', viewController.inventoryLogs);
router.get('/Booking', viewController.bookingPage);
router.get('/booked', viewController.bookedPage);
router.get('/Queue', viewController.queuePage);
router.get('/Patient', viewController.patientPage);
router.get('/patientList', viewController.patientList);

module.exports = router;
