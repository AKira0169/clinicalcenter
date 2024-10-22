const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  status: {
    type: String,
    enum: ['regular', 'exception'],
    default: 'regular',
  },
  date: { type: Date, required: true },
  availableStartTime: { type: String, required: true }, // e.g., "12:00"
  availableEndTime: { type: String, required: true }, // e.g., "15:00"
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
  ],
});

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
