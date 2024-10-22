const Note = require('./noteModle');

const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find({ clinicId: req.user.clinicID });
  res.status(200).json({ status: 'success', data: notes });
});

exports.getNotesByPatient = catchAsync(async (req, res, next) => {
  const notes = await Note.find({ patient: req.params.id, clinicId: req.user.clinicID });
  if (notes) {
    return next(new AppError('patient not found', 404));
  }
  res.status(200).json({ status: 'success', data: notes });
});

exports.createNote = catchAsync(async (req, res, next) => {
  const notedto = {
    clinicId: req.user.clinicID,
    patient: req.body.patient,
    note: req.body.note,
    createdAt: Date.now(),
  };

  const note = Note.create(notedto);

  if (!note) {
    return next(new AppError('patient not found', 404));
  }

  res.status(201).json({ status: 'success', data: note });
});
exports.updateNote = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body);
  if (!note) {
    return next(new AppError('patient not found', 404));
  }
  res.status(200).json({ status: 'success', data: note });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: 'success', data: note });
});
