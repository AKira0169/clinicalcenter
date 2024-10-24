const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { listObjects } = require('../../Middleware/trackClinicStorage');
const { generatePresignedUrl } = require('../../utils/generatePresignedUrl');

const Inventory = require('../inventory/inventoryModel');
const InventoryLogs = require('../inventoryLogs/inventoryLogsModel');
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

exports.home = catchAsync(async (req, res, next) => {
  res.render('layout', {
    title: 'Home',
    body: 'home',
  });
});

exports.inventory = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Get the current page from the request (default to 1)
  const limit = parseInt(req.query.limit) || 50; // Number of items per page (default to 10)
  const skip = (page - 1) * limit;

  const inventory = await Inventory.aggregate([
    // Add any filtering, grouping, or sorting stages here if necessary
    { $skip: skip },
    { $limit: limit },
  ]);

  // Optionally, you can calculate total items to return metadata for pagination
  const totalItems = await Inventory.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  res.render('layout', {
    title: 'Inventory',
    body: 'inventory',
    inventory,
    currentPage: page,
    totalPages,
    totalItems,
  });
});
exports.inventoryLogs = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Get the current page from the request (default to 1)
  const limit = parseInt(req.query.limit) || 10; // Number of items per page (default to 10)
  const skip = (page - 1) * limit;

  const inventoryLogs = await InventoryLogs.aggregate([
    // Add any filtering, grouping, or sorting stages here if necessary
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
  ]);

  console.log(inventoryLogs);

  // Optionally, you can calculate total items to return metadata for pagination
  const totalItems = await InventoryLogs.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  res.render('layout', {
    title: 'Inventory Logs',
    body: 'inventoryLogs',
    inventoryLogs,
    currentPage: page,
    totalPages,
    totalItems,
  });
});
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
