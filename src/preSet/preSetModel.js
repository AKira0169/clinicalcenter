const mongoose = require('mongoose');

const preSetSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  name: { type: String, required: [true, 'Please enter a name'] },
  currentMedications: [
    {
      title: String,
      comment: String,
    },
  ],
  requestedInvestigations: [
    {
      title: String,
      comment: String,
    },
  ],
  note: String,
  clinic: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Please enter a clinic'],
  },
});

const PreSet = mongoose.model('PreSet', preSetSchema);

module.exports = PreSet;
