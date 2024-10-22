const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('NO document fond with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no document found with that Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
      query = query.populate(popOptions.patientRecord).populate({
        path: popOptions.patientScale,
        select: 'EDSS createdAt -patient -_id',
      });
    const doc = await query;
    if (!doc) {
      return next(new AppError('NO document fond with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
// exports.getAll = (Model) =>
//   catchAsync(async (req, res, next) => {
//     // To allow for nested Get reviews on tour (hack)
//     let filter = {};
//     if (req.params.tourId) {
//       filter = { tour: req.params.tourId };
//     }
//     Excute Query
//     const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     eslint-disable-next-line no-undef
//     const doc = await features.query;

//     //Send response
//     res.status(200).json({
//       status: 'success',
//       results: doc.length,
//       data: {
//         data: doc,
//       },
//     });
//   });
