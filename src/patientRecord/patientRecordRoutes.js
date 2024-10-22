const express = require('express');
const patientRecordController = require('./patientRecordController');
const authenticationController = require('../../Middleware/authenticationController');
const advSearchController = require('../../Middleware/advSearchController');
const { upload } = require('../../config/multerConfig');
const { processAndUploadImages } = require('../../Middleware/upLoadImage');

const router = express.Router();
router.use(authenticationController.protect);

router.route('/').get(patientRecordController.getAllPatientRecords);
router.get('/getPatientsByDate', patientRecordController.getPatientsByDate);

router.post(
  '/createPatientRecordNew/:Id',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  upload.array('MRI'),
  processAndUploadImages('ImagesMri'),
  patientRecordController.createPatientRecordNew,
);
router.patch(
  '/editPatientRecordNew/:Id',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  upload.array('MRI'),
  processAndUploadImages('ImagesMri'),
  patientRecordController.editPatientRecordNew,
);

router.delete(
  '/deletePatientRecord/:Id',
  authenticationController.restrictTo('admin'),
  patientRecordController.deleteRecord,
);

router.post('/getOnePatientRecord/:Id', patientRecordController.getOnePatientRecord);

router.post('/advanced-search', advSearchController.search);

router.post('/advanced-testadvsearch', advSearchController.testadvsearch);

router.post('/searchgato', patientRecordController.dataSearch);
router.post(
  '/sendMRI',
  authenticationController.protect,
  upload.array('MRI'),
  processAndUploadImages('ImagesMri'),
  patientRecordController.uploadMRIPhotos,
);
router.get('/getPatientFiles/:Id', patientRecordController.getPatientFiles);
router.patch(
  '/updatePatientRecord/:Id',
  authenticationController.protect,
  upload.array('MRI'),
  processAndUploadImages('ImagesMri'),
  patientRecordController.patchRecord,
);
router.delete(
  '/deletePatientFile/:Id',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  patientRecordController.deleteFiles,
);

module.exports = router;
