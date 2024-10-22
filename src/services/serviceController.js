const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const Services = require('./serviceModel');

exports.createService = catchAsync(async (req, res, next) => {
  const branch = await Branch.findById(req.body.branchId);
  if (!branch) {
    return next(new AppError('branch not found', 404));
  }

  const service = await Services.create(req.body);
  branch.services.push(service);
  await branch.save();

  res.status(200).json({
    status: 'success',
    data: service,
  });
});

exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Services.find();
  res.status(200).json({
    status: 'success',
    data: services,
  });
});

exports.getService = catchAsync(async (req, res, next) => {
  const service = await Services.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: service,
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Services.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: service,
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Services.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: service,
  });
});
