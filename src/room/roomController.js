const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Room = require('./roomModel');

exports.createRoom = catchAsync(async (req, res, next) => {
  const room = await Room.create(req.body);
  if (!room) {
    return next(new AppError('Failed to create room', 500));
  }
  res.status(200).json({
    status: 'success',
    data: room,
  });
});

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.find();
  res.status(200).json({
    status: 'success',
    data: rooms,
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: room,
  });
});
exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) {
    return next(new AppError('Room not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: room,
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: room,
  });
});
