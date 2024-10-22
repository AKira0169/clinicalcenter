const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  bookings: [
    {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    },
  ],
});

module.exports = mongoose.model('Room', roomSchema);
