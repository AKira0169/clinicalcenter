const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  note: String,
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
