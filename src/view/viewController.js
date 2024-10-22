const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { listObjects } = require('../../Middleware/trackClinicStorage');
const { generatePresignedUrl } = require('../../utils/generatePresignedUrl');

const Patient = require('../patient/patientModel');
const Booking = require('../booking/bookingModel');
const Service = require('../services/serviceModel');
const Invoice = require('../invoice/invoiceModel');
const RefDoctor = require('../contact/contactModel');
const PreSet = require('../preSet/preSetModel');
const User = require('../user/userModel');
const Note = require('../note/noteModle');
const PatientRecord = require('../patientRecord/patientRecordModel');
const Statistics = require('../statistics/statisticsModel');
const PreScription = require('../prescription/prescriptionModel');
const Video = require('../video/videoModel');

const DateConvertorr = date => (date ? new Date(date).toLocaleString('en-US', { month: 'long' }) : 'NO DATE');

const DateConvertor = date => {
  if (date === null) {
    date = 'NO DATE';
  }
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
function FORMATDATETOYYYYMMDD(dateString) {
  if (dateString === null || dateString === undefined) {
    return;
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

exports.bookingPage = catchAsync(async (req, res, next) => {
  res.render('layout', {
    title: 'Booking',
    body: 'Booking',
  });
});
exports.bookedPage = catchAsync(async (req, res, next) => {
  res.render('layout', {
    title: 'booked',
    body: 'booked',
  });
});

exports.queuePage = catchAsync(async (req, res, next) => {
  res.render('layout', {
    title: 'Queue',
    body: 'Queue',
  });
});
exports.patientPage = catchAsync(async (req, res, next) => {
  res.render('layout', {
    title: 'Patient',
    body: 'patient',
  });
});
