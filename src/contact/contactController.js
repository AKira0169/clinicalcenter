const catchAsync = require('../../utils/catchAsync');

const RefDr = require('./contactModel');

exports.createRefDr = catchAsync(async (req, res, next) => {
  req.body.clinicId = req.user.clinicID;
  const refDr = await RefDr.create(req.body);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});

exports.deleteRefDr = catchAsync(async (req, res, next) => {
  const refDr = await RefDr.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});

exports.getsearchedRefDr = catchAsync(async (req, res, next) => {
  const { keyword } = req.body;
  const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const refDr = await RefDr.aggregate([
    {
      $match: {
        $or: [
          { name: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { phoneNumber: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { description: new RegExp(`^${escapedKeyword}.*`, 'i') },
        ],
        clinicId: req.user.clinicID._id,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});
exports.ALLgetREfdr = catchAsync(async (req, res, next) => {
  const refDr = await RefDr.find({ clinic: req.user.clinic });

  res.send(refDr);
});
