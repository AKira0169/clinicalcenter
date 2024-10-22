const express = require('express');

const userController = require('./userController');
const authenticationController = require('../../Middleware/authenticationController');
const { upload } = require('../../config/multerConfig');
const { processAndUploadImages } = require('../../Middleware/upLoadImage');

const router = express.Router();

router.post('/login', authenticationController.loginFailedLimiter, authenticationController.login);
router.get('/', userController.getAllUsers);

router.post('/forgotPassword', authenticationController.emailResetLimiter, authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);
router.get('/refresh-token', authenticationController.refreshToken);

router.post('/signup', authenticationController.signUp);
router.delete('/deleteUser/:id', authenticationController.deleteUserById);
router.get('/logout', authenticationController.logout);
router.patch(
  '/updateUser/:id',

  upload.single('photo'),
  processAndUploadImages('personalPhoto'),
  userController.updateMe,
);
router.patch('/updateuserHorzantel', userController.updateTypeOfRecord);
router.patch('/updateMyPassword/:id', authenticationController.updatePassword);

router.get(
  '/sendVerifyCode',

  authenticationController.emailVerifyLimiter,
  authenticationController.sendVerifyCode,
);
router.get('/verifyemail/:token', authenticationController.verifyEmail);

router.get('/specialization/:specialization', userController.specialization);

module.exports = router;
