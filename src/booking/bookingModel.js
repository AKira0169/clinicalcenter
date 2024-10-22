const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorSchedule',
      required: [true, 'The record must belong to a doctor'],
    },
    appointmentStartTime: { type: String, required: true }, // e.g., "12:30"
    appointmentEndTime: { type: String, required: true }, // e.g., "12:40"
    status: {
      type: String,
      enum: ['pending', 'inQueue', 'inProgress', 'completed'],
    },

    date: {
      type: Date,
      required: [true, 'The book must have a date'],
    },
    note: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
