const express = require('express');

const doctorScheduleController = require('./doctorScheduleController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

// router.use(authenticationController.protect);
router.post('/create-doctor-schedule', doctorScheduleController.createDoctorSchedule);
router.get('/availableDates/:doctorId', doctorScheduleController.availableDates);

module.exports = router;
