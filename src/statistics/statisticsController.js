const catchAsync = require('../../utils/catchAsync');
const Patient = require('../patient/patientModel');
// const PatientRecord = require('../models/patientRecordModel');
// const Preset = require('../models/preSetModel');
// const refDr = require('../models/refDrModel');
// const prescription = require('../models/prescriptionModel');
const Booking = require('../booking/bookingModel');
const Statistics = require('./statisticsModel');

const DateConvertor = date => (date ? new Date(date).toLocaleString('en-US', { month: 'long' }) : 'NO DATE');

exports.patientCount = catchAsync(async (req, res, next) => {
  // await Patient.updateMany(
  //   { clinic: 'nuroclinic' }, // Query to match documents
  //   { $set: { clinicId: '667f2e526218ec6f5a067ae3' } }, // Update to set the new field
  // );
  // await PatientRecord.updateMany(
  //   { clinic: 'nuroclinic' }, // Query to match documents
  //   { $set: { clinicId: '667f2e526218ec6f5a067ae3' } }, // Update to set the new field
  // );
  // await Preset.updateMany(
  //   { clinic: 'nuroclinic' }, // Query to match documents
  //   { $set: { clinicId: '667f2e526218ec6f5a067ae3' } }, // Update to set the new field
  // );
  // await refDr.updateMany(
  //   { clinic: 'nuroclinic' }, // Query to match documents
  //   { $set: { clinicId: '667f2e526218ec6f5a067ae3' } }, // Update to set the new field
  // );
  // await prescription.updateMany(
  //   { clinic: 'nuroclinic' }, // Query to match documents
  //   { $set: { clinicId: '667f2e526218ec6f5a067ae3' } }, // Update to set the new field
  // );
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
  let getYear = await Statistics.findOne({ clinicId: req.user.clinicID, year: currentYear });
  const thisMonth = await Patient.countDocuments({ clinicId: req.user.clinicID, createdAt: { $gte: startOfMonth } });
  const PreviousMonth =
    (await Patient.countDocuments({
      clinicId: req.user.clinicID,
      createdAt: { $lt: startOfMonth, $gte: startOfPreviousMonth },
    })) || 1;

  const growth = ((thisMonth - PreviousMonth) / PreviousMonth) * 100;
  if (getYear) {
    const currentMonthh = DateConvertor(startOfMonth); // Convert the date to the required month format
    // Extract the month values from the growth array
    const months = getYear.growth.map(g => g.month);
    // Find the index of the current month
    const monthIndex = months.indexOf(currentMonthh);
    if (monthIndex !== -1) {
      // If the month exists, update its growth value
      getYear.growth[monthIndex].growth = growth;
    } else {
      // If the month does not exist, create a new object and add it to the array
      getYear.growth.push({ month: currentMonthh, growth: growth });
    }
    // Save the updated document
    await getYear.save();
  }

  if (!getYear) {
    getYear = await Statistics.create({ clinicId: req.user.clinicID, year: currentYear });
  }
  const previousMonthName = DateConvertor(startOfPreviousMonth);
  if (!getYear.month.includes(previousMonthName)) {
    getYear.month.push(previousMonthName);
  }
  if (!getYear.newPatients.includes(PreviousMonth)) {
    getYear.newPatients.push(PreviousMonth);
  }
  await getYear.save();

  if (!req.bypassing) {
    if (req.url.endsWith('/Dashboard')) {
      return next();
    }
  }
  getYear.month.push(DateConvertor(startOfMonth));
  getYear.newPatients.push(thisMonth);

  if (req.bypassing) {
    return 1;
  }
  res.status(200).json({
    status: 'success',
    getYear,
  });
});

exports.trackingVisits = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);

  const dataOftheTraffic = await Booking.find({
    clinic: req.user.clinicID,
    createdAt: { $gte: startOfMonth },
    status: 'completed',
  }).populate('service');

  const analyzeServices = bookings => {
    const serviceCounts = {};
    bookings.forEach(booking => {
      const serviceName = booking.service.name;
      if (!serviceCounts[serviceName]) {
        serviceCounts[serviceName] = 0;
      }
      serviceCounts[serviceName]++;
    });
    return serviceCounts;
  };

  const serviceCounts = analyzeServices(dataOftheTraffic);

  const holdingDataOfTriffic = {};
  const month = DateConvertor(startOfMonth);

  if (!holdingDataOfTriffic[month]) {
    holdingDataOfTriffic[month] = [];
  }

  for (const [serviceName, count] of Object.entries(serviceCounts)) {
    holdingDataOfTriffic[month].push({ name: serviceName, count });
  }

  const visitsOfCurrentMonth = dataOftheTraffic.length;

  let getYear = await Statistics.findOne({ clinicId: req.user.clinicID, year: currentYear });
  if (!getYear) {
    getYear = await Statistics.create({ clinicId: req.user.clinicID, year: currentYear });
  }

  const monthString = DateConvertor(startOfMonth);
  const monthIndex = getYear.monthForVisits.indexOf(monthString);
  if (monthIndex !== -1) {
    getYear.countOfVisits[monthIndex] = visitsOfCurrentMonth;
  } else {
    getYear.monthForVisits.push(monthString);
    getYear.countOfVisits.push(visitsOfCurrentMonth);
  }

  Object.entries(holdingDataOfTriffic).forEach(([month, data]) => {
    const existingMonthIndex = getYear.holdingDataOfTriffic.findIndex(item => item.month === month);
    if (existingMonthIndex !== -1) {
      getYear.holdingDataOfTriffic[existingMonthIndex].data = data;
    } else {
      getYear.holdingDataOfTriffic.push({ month, data });
    }
  });

  await getYear.save();

  if (req.bypassing) {
    return 1;
  }

  res.status(200).json({
    status: 'success',
    getYear,
    visitsOfCurrentMonth,
  });
});
