const PreScription = require('./prescriptionModel');
const catchAsync = require('../../utils/catchAsync');

exports.createPreScription = catchAsync(async (req, res, next) => {
  req.body.clinicId = req.user.clinicID;
  const preScription = await PreScription.create(req.body);
  res.status(200).json({
    status: 'success',
    data: preScription,
  });
});
