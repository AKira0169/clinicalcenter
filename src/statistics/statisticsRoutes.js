const express = require('express');

const statisticsController = require('./statisticsController');
// const loopingController = require('../controllers/looping');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

router.use(authenticationController.protect);
router.get('/patientCount', statisticsController.patientCount);
router.get('/trackingVisits', statisticsController.trackingVisits);
// router.get('/loopingmidnight', loopingController.loopingmidnight); // Define the loopingmidnight endpoint here

module.exports = router;
