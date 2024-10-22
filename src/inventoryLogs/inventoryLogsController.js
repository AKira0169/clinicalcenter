const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const InventoryLogs = require('./inventoryLogsModel');

exports.getAllInventoryLogs = catchAsync(async (req, res, next) => {
  const inventoryLogs = await InventoryLogs.find();
  res.status(200).json({
    status: 'success',
    data: inventoryLogs,
  });
});

exports.getInventoryLog = catchAsync(async (req, res, next) => {
  const inventoryLog = await InventoryLogs.findById(req.params.id);
  if (!inventoryLog) {
    return next(new AppError('Inventory log not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: inventoryLog,
  });
});

exports.updateInventoryLog = catchAsync(async (req, res, next) => {
  const inventoryLog = await InventoryLogs.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!inventoryLog) {
    return next(new AppError('Inventory log not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: inventoryLog,
  });
});

exports.deleteInventoryLog = catchAsync(async (req, res, next) => {
  const inventoryLog = await InventoryLogs.findByIdAndDelete(req.params.id);
  if (!inventoryLog) {
    return next(new AppError('Inventory log not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: inventoryLog,
  });
});
