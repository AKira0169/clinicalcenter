const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
    required: [true, 'The record must belong to an invoice'],
  },
  method: {
    type: String,
    enum: ['Cash', 'Card', 'Transfer'],
    default: 'Cash',
  },
  amount: {
    type: Number,
    required: [true, 'The record must have an amount'],
  },
  date: {
    type: Date,
    default: Date.now(),
    required: [true, 'The payment must have a date'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Completed',
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
