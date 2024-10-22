const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const DoctorSchedule = require('./doctorScheduleModel');

const Room = require('../room/roomModel');
const { isRoomAvailable } = require('../../Middleware/RoomAvailability');

exports.createDoctorSchedule = catchAsync(async (req, res, next) => {
  const { doctorId, roomId, date, availableStartTime, availableEndTime } = req.body;

  // Check if the room is available
  const room = await Room.findById(roomId);

  const roomAvailable = await isRoomAvailable(room, new Date(date), availableStartTime, availableEndTime);
  if (!roomAvailable) {
    return next(new AppError('Room is not available at the selected time', 400));
  }

  // Create the doctor's schedule
  const newSchedule = new DoctorSchedule({
    doctorId,
    roomId,
    date,
    availableStartTime,
    availableEndTime,
    bookings: [],
  });

  await newSchedule.save();

  // Add the booking to the room's bookings
  room.bookings.push({
    date: new Date(date),
    startTime: availableStartTime,
    endTime: availableEndTime,
    doctorId,
  });

  await room.save();

  res.status(201).json({ status: 'success', message: 'Doctor schedule created successfully', data: newSchedule });
});
exports.availableDates = catchAsync(async (req, res, next) => {
  const { doctorId } = req.params;
  const doctorSchedule = await DoctorSchedule.find({ doctorId });
  const availableDates = doctorSchedule.map(schedule => schedule.date.toISOString().split('T')[0]);
  res.status(200).json({ status: 'success', availableDates });
});
