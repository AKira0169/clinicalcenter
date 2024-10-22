const mongoose = require('mongoose');

const refDrSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  name: String,
  description: String,
  phoneNumber: [String],
  email: String,
  clinic: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Please enter a clinic'],
  },
  slug: String,
});

const RefDr = mongoose.model('RefDr', refDrSchema);

module.exports = RefDr;
