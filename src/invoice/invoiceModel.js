const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  clinicId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Clinic',
    required: [true, 'The record must belong to a clinic'],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  forWhichDoctor: {
    type: String,
  },
  discount: {
    type: Number, // or you could have type: Object if discounts have more complexity
    default: 0,
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: [true, 'The invoice must belong to a service'],
  },
  amount: {
    type: Number,
    required: [true, 'The invoice must have an amount'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
