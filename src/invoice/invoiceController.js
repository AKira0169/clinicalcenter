const { Parser } = require('json2csv');

const Invoice = require('./invoiceModel');
const Service = require('../services/serviceModel');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.createInvoice = catchAsync(async (req, res, next) => {
  req.body.createdAt = Date.now();
  const service = await Service.findById(req.body.service);
  if (!service) {
    return next(new AppError('service not found', 404));
  }
  req.body.amount = service.price;
  req.body.clinicId = req.user.clinicID;
  const invoice = await Invoice.create(req.body);

  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find();
  res.status(200).json({
    status: 'success',
    data: invoices,
  });
});

exports.getInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!invoice) {
    return next(new AppError('invoice not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});
exports.discount = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new AppError('invoice not found', 404));
  }
  if (invoice.amount < req.body.discount) {
    return next(new AppError('discount cannot be greater than amount', 404));
  }

  invoice.discount = req.body.discount;
  await invoice.save();
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});
exports.deleteInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.getInvoiceByPatient = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.find({ patient: req.params.id });
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.getInvoiceByService = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.find({ service: req.params.id });
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.getInvoiceByStatus = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.find({ status: req.params.status });
  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});
exports.getInvoiceByDate = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
  const startOfNextDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
  );
  let { startDate, endDate } = req.query;
  console.log(startDate, endDate, req.query);
  if (!startDate || !endDate) {
    startDate = startOfDay;
    endDate = startOfNextDay;
  }
  const invoice = await Invoice.find({
    $and: [
      { clinicId: req.user.clinicID },
      { createdAt: { $gte: startDate } },
      { createdAt: { $lte: endDate } }, // Use the modified endDate here
    ],
  }).populate('service  payment');

  res.status(200).json({
    status: 'success',
    data: invoice,
  });
});

exports.printInvoices = catchAsync(async (req, res, next) => {
  const fd = req.body;

  // Handle date range logic
  if (fd.startDate && fd.endDate) {
    fd.startDate = new Date(fd.startDate);
    fd.endDate = new Date(fd.endDate);
  } else {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    const startOfNextDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      0,
      0,
      0,
    );
    fd.startDate = startOfDay;
    fd.endDate = startOfNextDay;
  }

  // Fetch invoices for the clinic within the specified date range
  const invoices = await Invoice.find({
    $and: [{ clinicId: req.user.clinicID }, { createdAt: { $gte: fd.startDate } }, { createdAt: { $lte: fd.endDate } }],
  }).populate('service payment patient'); // Added 'patient' to the populate

  if (!invoices || invoices.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'No invoices found for the given date range',
    });
  }

  // Step 1: Aggregate the data by doctor and services
  const doctorServices = {};
  let totalAmountBeforeDiscount = 0; // Track total amount before discount
  let totalDiscounts = 0; // Track total discounts
  let finalTotalAmount = 0; // Track the final amount after discount

  const discountedPatientsByService = {}; // Track patients who received discounts for each service

  invoices.forEach(invoice => {
    const doctorName = invoice.forWhichDoctor;
    const servicePrice = Number(invoice.service.price);
    const serviceName = invoice.service.name;
    const createdAt = new Date(invoice.createdAt);
    const dayOfWeek = createdAt.toLocaleString('en-US', { weekday: 'long' });
    const date = createdAt.toLocaleDateString();
    const patientName = invoice.patient ? invoice.patient.name : 'Unknown';

    // Calculate discount for this invoice
    const discount = invoice.discount || 0; // Default to 0 if no discount applied
    const totalAfterDiscount = servicePrice - discount;

    // If the invoice has a discount, track the patient name for this specific service
    if (discount > 0) {
      if (!discountedPatientsByService[doctorName]) {
        discountedPatientsByService[doctorName] = {};
      }
      if (!discountedPatientsByService[doctorName][serviceName]) {
        discountedPatientsByService[doctorName][serviceName] = new Set(); // Use a Set to avoid duplicate names
      }
      discountedPatientsByService[doctorName][serviceName].add(patientName); // Add the patient's name if they got a discount for this service
    }

    // Initialize doctor service entry if not exists
    if (!doctorServices[doctorName]) {
      doctorServices[doctorName] = {
        services: {},
      };
    }

    // Initialize service entry if not exists
    if (!doctorServices[doctorName].services[serviceName]) {
      doctorServices[doctorName].services[serviceName] = {
        count: 0,
        totalBeforeDiscount: 0, // Track total before discount
        totalDiscount: 0, // Track total discounts
        finalTotal: 0, // Track final total after discount
        dayOfWeek: dayOfWeek,
        date: date,
      };
    }

    // Increment service count, total before discount, total discount, and final total
    doctorServices[doctorName].services[serviceName].count += 1;
    doctorServices[doctorName].services[serviceName].totalBeforeDiscount += servicePrice;
    doctorServices[doctorName].services[serviceName].totalDiscount += discount;
    doctorServices[doctorName].services[serviceName].finalTotal += totalAfterDiscount;

    // Aggregate overall totals
    totalAmountBeforeDiscount += servicePrice;
    totalDiscounts += discount;
    finalTotalAmount += totalAfterDiscount;
  });

  // Step 2: Prepare the CSV data
  const csvData = [];

  // Loop through doctors and their services
  Object.entries(doctorServices).forEach(([doctorName, doctorData]) => {
    Object.entries(doctorData.services).forEach(([serviceName, serviceData]) => {
      // Add concatenated list of discounted patients' names for this specific service
      const discountedPatientsList =
        discountedPatientsByService[doctorName] && discountedPatientsByService[doctorName][serviceName]
          ? Array.from(discountedPatientsByService[doctorName][serviceName]).join(', ')
          : ''; // If no discounts for this service, leave the field empty

      csvData.push({
        Doctor: doctorName,
        'Service Name': serviceName,
        Day: serviceData.dayOfWeek,
        Date: serviceData.date,
        'Service Count': serviceData.count,
        'Total Before Discount': serviceData.totalBeforeDiscount,
        'Total Discount': serviceData.totalDiscount,
        'Final Total': serviceData.finalTotal, // Final total after discount
        'Discounted Patients': discountedPatientsList, // New field for discounted patients per service
      });
    });
  });

  // Add the totals for all doctors at the end
  csvData.push({
    Doctor: 'All Doctors',
    'Service Name': '',
    Day: '',
    Date: '',
    'Service Count': '',
    'Total Before Discount': totalAmountBeforeDiscount,
    'Total Discount': totalDiscounts,
    'Final Total': finalTotalAmount,
    'Discounted Patients': '', // Empty field for total row
  });

  // Step 3: Define the fields for CSV
  const fields = [
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Service Name', value: 'Service Name' },
    { label: 'Day', value: 'Day' },
    { label: 'Date', value: 'Date' },
    { label: 'Service Count', value: 'Service Count' },
    { label: 'Total Before Discount', value: 'Total Before Discount' },
    { label: 'Total Discount', value: 'Total Discount' },
    { label: 'Final Total', value: 'Final Total' },
    { label: 'Discounted Patients', value: 'Discounted Patients' }, // New field for discounted patients per service
  ];

  // Convert to CSV
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(csvData);

  // Add BOM for UTF-8 encoding
  const bom = '\uFEFF';
  const csvWithBOM = bom + csv;

  // Set headers to trigger file download in the browser with UTF-8 encoding
  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.header('Content-Disposition', 'attachment; filename="invoices.csv"');

  // Send CSV with BOM as response
  res.status(200).send(csvWithBOM);
});
