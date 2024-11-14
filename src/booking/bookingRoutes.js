const express = require('express');

const bookingController = require('./bookingController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

// router.use(authenticationController.protect);

router.post('/', bookingController.createBooking);
router.post('/book-patient', bookingController.bookPatientAppointment);
router.post('/searchbynameorphone', bookingController.searchbynameorphone);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);
router.get('/getAvailableSlots/:doctorId/:date', bookingController.getAvailableSlots);

module.exports = router;
