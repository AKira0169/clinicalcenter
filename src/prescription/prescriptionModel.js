const mongoose = require('mongoose');

const PreScriptionSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  header1: String,
  header2: String,
  header3: String,
  header4: String,
  header5: String,
  content: String,
  footer: String,
  logo: String,
  whatsapp: String,
  phoneNumber: String,
  email: String,
  clinic: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Please enter a clinic'],
  },
});

const PreScription = mongoose.model('PreScription', PreScriptionSchema);
module.exports = PreScription;
