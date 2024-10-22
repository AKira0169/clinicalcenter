const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { deleteS3Object } = require('../../utils/deleteS3Object');
const Video = require('./videoModel');
const Patient = require('../patient/patientModel');

exports.uploadVideo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }
  const patient = await Patient.findById(req.body.patient);
  if (!patient) {
    return next(new AppError('patient not found', 404));
  }
  req.body.patient = patient._id;
  const videoDTO = {
    video: req.file.s3Key || req.file.originalname,
    patient: patient._id,
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
  };
  console.log(videoDTO);
  const video = await Video.create(videoDTO);
  res.status(200).json({
    status: 'success',
    data: video,
  });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }
  if (video.video) {
    await deleteS3Object(video.video);
  }
  res.status(200).json({
    status: 'success',
    data: video,
  });
});
