const crypto = require('crypto');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { deleteS3Object } = require('../../utils/deleteS3Object');

const User = require('./userModel');

exports.updateMe = catchAsync(async (req, res, next) => {
  const userDate = JSON.parse(req.body.data);
  // Retrieve the old photo filename from the user document
  const user = await User.findById(req.user.id);
  if (req.file) {
    const oldPhotoFilename = user.photo;
    if (oldPhotoFilename !== 'default.jpg') {
      await deleteS3Object(oldPhotoFilename);
    }
    userDate.photo = req.file.s3Key;
  }
  // Update the user document with the new information
  if (user.email !== userDate.email) {
    userDate.verified = false;
    userDate.verifyToken = crypto.randomBytes(32).toString('hex');
    userDate.verifyTokenExpires = Date.now() + 10 * 60 * 1000;
  }
  await User.findByIdAndUpdate(req.user.id, userDate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.updateTypeOfRecord = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { typeOfRecord: req.body.data });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.specialization = catchAsync(async (req, res, next) => {
  const users = await User.find({ specialization: req.params.specialization });
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
