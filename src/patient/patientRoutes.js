const express = require('express');

const patientController = require('./patientController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
// router.use(protectRoutes);
router.post('/get-patient', patientController.getSpatient);
// router.post('/get-patientt', patientController.getPatientt);
// router.post('/get-Patienttt', patientController.getPatienttt);
// router.use(authenticationController.protect);
router.route('/').get(patientController.getAllPatients).post(patientController.createPatient);

router.get('/get-patient/:id', patientController.getPatient);
router.get('/homeSearch', patientController.homeSearch);

router.delete('/delete-patient/:id', patientController.deletePatient);

router.patch('/update-patient/:id', patientController.updatePatient);

module.exports = router;
