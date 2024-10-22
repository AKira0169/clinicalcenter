const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Payment = require('./paymentModel');
const Invoice = require('../invoice/invoiceModel');

exports.createPayment = catchAsync(async (req, res, next) => {
  const bodyAmount = parseInt(req.body.amount);
  const invoice = await Invoice.findById(req.body.invoice).populate('payment');
  if (!invoice) {
    return next(new AppError('invoice not found', 404));
  }
  const finalAmount = invoice.amount - (invoice.discount || 0);
  if (invoice.status === 'Paid') {
    return next(new AppError('The invoice is already paid', 401));
  }

  let amount = 0;
  invoice.payment.forEach(payment => {
    amount += payment.amount;
  });
  console.log(amount, bodyAmount, finalAmount);
  if (amount + bodyAmount > finalAmount) {
    return next(new AppError('The amount is greater than the invoice amount .', 401));
  }
  if (amount + bodyAmount === finalAmount) {
    req.body.status = 'Completed';
    invoice.status = 'Paid';
    await invoice.save();
  }

  const payment = await Payment.create(req.body);

  invoice.payment.push(payment.id);
  await invoice.save();
  res.status(200).json({
    status: 'success',
    data: payment,
  });
});
exports.getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find();
  res.status(200).json({
    status: 'success',
    data: payments,
  });
});

exports.getPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: payment,
  });
});
exports.updatePayment = catchAsync(async (req, res, next) => {
  const x = await Payment.findById(req.params.id);
  const invoice = await Invoice.findById(x.invoice).populate('payment');
  if (!invoice) {
    return next(new AppError('invoice not found', 404));
  }
  const finalAmount = invoice.amount - (invoice.discount || 0);

  let amount = 0;
  invoice.payment.forEach(payment => {
    amount += payment.amount;
  });

  if (amount > finalAmount) {
    return next(new AppError('The amount is greater than the invoice amount .', 401));
  }
  if (amount === finalAmount) {
    req.body.status = 'Completed';

    invoice.status = 'Paid';
    await invoice.save();
  }

  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: payment,
  });
});

exports.deletePayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: payment,
  });
});
