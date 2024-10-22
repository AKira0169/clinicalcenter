const Booking = require('./bookingModel');
const DoctorSchedule = require('../doctorSchedule/doctorScheduleModel');
const generateTimeSlots = require('../../Middleware/generateTimeSlots');
const Invoice = require('../invoice/invoiceModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.bookPatientAppointment = catchAsync(async (req, res, next) => {
  const { doctorId, date, patientId, appointmentStartTime: startTime, note } = req.body;

  // Validate inputs
  if (!doctorId || !date || !patientId || !startTime) {
    return next(
      new AppError('Please provide all the required fields: doctorId, date, patientId, and appointmentStartTime', 400),
    );
  }

  // Find the doctor's schedule for the selected date
  const doctorSchedule = await DoctorSchedule.findOne({ doctorId, date: new Date(date) });

  if (!doctorSchedule) {
    return next(new AppError('No schedule found for the doctor on the selected date', 404));
  }

  // Convert appointment start time to a Date object and automatically calculate the end time (10 minutes later)
  const appointmentStartTime = new Date(`${doctorSchedule.date.toISOString().split('T')[0]}T${startTime}:00.000Z`);
  const appointmentEndTime = new Date(appointmentStartTime.getTime() + 10 * 60 * 1000); // Add 10 minutes

  const availableStartTime = new Date(doctorSchedule.availableStartTime);
  const availableEndTime = new Date(doctorSchedule.availableEndTime);

  // Check if the requested time slot is within the available time for the doctor
  if (appointmentStartTime < availableStartTime || appointmentEndTime > availableEndTime) {
    return next(new AppError("The requested time slot is outside the doctor's available hours", 400));
  }

  // Check for conflicts with existing bookings
  const isTimeSlotBooked = await Promise.all(
    doctorSchedule.bookings.map(async bookingId => {
      const booking = await Booking.findById(bookingId);

      // Convert existing booking times to Date objects
      const existingStartTime = new Date(booking.appointmentStartTime);
      const existingEndTime = new Date(booking.appointmentEndTime);

      // Check for any overlap between the new and existing bookings
      return (
        (appointmentStartTime < existingEndTime && appointmentEndTime > existingStartTime) || // Overlap check
        (appointmentStartTime <= existingStartTime && appointmentEndTime >= existingEndTime) // Fully overlaps
      );
    }),
  );

  // If any of the existing bookings conflict with the new one, return an error
  if (isTimeSlotBooked.some(isBooked => isBooked)) {
    return next(new AppError('The requested time slot is already booked', 409));
  }

  // Create a new booking document
  const newBooking = await Booking.create({
    patientId,
    doctor: doctorSchedule._id, // reference to the doctor's schedule
    appointmentStartTime,
    appointmentEndTime,
    date: new Date(date),
    note,
    status: 'pending', // Set an initial status
  });

  // Add the new booking's ID to the doctor's schedule
  doctorSchedule.bookings.push(newBooking._id);
  await doctorSchedule.save();

  // Return success response
  res.status(201).json({
    status: 'success',
    message: 'Appointment booked successfully',
    data: {
      doctorId,
      date,
      patientId,
      appointmentStartTime,
      appointmentEndTime,
      bookingId: newBooking._id,
    },
  });
});

exports.getAvailableSlots = catchAsync(async (req, res, next) => {
  const { doctorId, date } = req.params; // Assume doctorId and date are coming from request

  // Find the doctor's schedule for the selected date
  const doctorSchedule = await DoctorSchedule.findOne({
    doctorId,
    date: new Date(date),
  }).populate('bookings'); // Populate the bookings

  if (!doctorSchedule) {
    return next(new AppError('No schedule found for the doctor on the selected date', 404));
  }

  // Get the available start and end times from the schedule
  const availableStartTime = new Date(doctorSchedule.availableStartTime).toISOString().split('T')[1].substring(0, 5); // "HH:MM"
  const availableEndTime = new Date(doctorSchedule.availableEndTime).toISOString().split('T')[1].substring(0, 5); // "HH:MM"

  // Get the appointment start and end times for each booking
  const bookedSlots = doctorSchedule.bookings.map(booking => ({
    appointmentStartTime: new Date(booking.appointmentStartTime).toISOString().split('T')[1].substring(0, 5),
    appointmentEndTime: new Date(booking.appointmentEndTime).toISOString().split('T')[1].substring(0, 5),
  }));

  // Generate available time slots
  const availableSlots = generateTimeSlots(availableStartTime, availableEndTime, bookedSlots);

  // Return the available slots
  res.status(200).json({
    status: 'success',

    availableSlots,
  });
});

exports.getAllBookingByClinic = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
  const startOfNextDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
  );
  const booking = await Booking.find({
    $and: [{ branch: req.user.branch }, { date: { $gte: startOfDay, $lt: startOfNextDay } }],
  })
    .populate('patient')
    .populate('service');

  req.queue = booking;
  next();
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const existingQueue = await Booking.findOne({
    date: req.body.date,
    clinic: req.user.clinicID,
  });
  if (existingQueue) {
    return next(new AppError('This date is already taken', 409));
  }
  req.body.clinic = req.user.clinicID;
  console.log(req.body);
  const booking = await Booking.create(req.body);
  if (booking.status === 'inQueue') {
    await booking.populate('service');
    await Invoice.create({
      createdAt: Date.now(),
      patient: booking.patient,
      service: booking.service,
      amount: booking.service.price,
      forWhichDoctor: booking.forWhichDoctor,
      clinicId: req.user.clinicID,
      status: 'Pending',
    });
  }
  res.status(200).json({
    status: 'success',
    data: booking,
  });
});
exports.updateBooking = catchAsync(async (req, res, next) => {
  req.body.date = Date.now();

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('service');

  if (!booking) {
    return next(new AppError('booking not found', 404));
  }

  if (req.body.status === 'inQueue') {
    await Invoice.create({
      patient: booking.patient,
      service: booking.service,
      amount: booking.service.price,
      clinicId: booking.clinic,
      forWhichDoctor: booking.forWhichDoctor,

      status: 'Pending',
    });
  }

  res.status(200).json({
    status: 'success',
    data: booking,
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).json({
    status: 'success',
    data: bookings,
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: booking,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: booking,
  });
});

exports.getspsificdate = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
  const startOfNextDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
    0,
    0,
    0,
  );
  let { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    startDate = startOfDay;
    endDate = startOfNextDay;
  }

  const specificDate = await Booking.find({
    $and: [
      { branch: req.user.branch },
      { date: { $gte: startDate } },
      { date: { $lte: endDate } }, // Use the modified endDate here
    ],
  }).populate('patient service branch');
  req.queue = specificDate;
  next();
});

exports.searchbynameorphone = catchAsync(async (req, res, next) => {
  const { keyword } = req.body;
  const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const result = await Booking.aggregate([
    {
      $match: {
        $and: [{ status: 'pending' }, { branch: req.user.branch._id }],
      },
    },
    {
      $lookup: {
        from: 'patients', // Assuming the name of the collection is "patients"
        localField: 'patient', // Field in the QueuePatients collection
        foreignField: '_id', // Field in the patients collection
        as: 'patient', // Alias for the joined documents
      },
    },
    {
      $unwind: '$patient', // Deconstruct the patient array
    },
    {
      $match: {
        $or: [
          { 'patient.name': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
          { 'patient.phoneNumber': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
          { 'patient.serial': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
        ],
      },
    },
    {
      $lookup: {
        from: 'services', // Assuming the name of the collection is "services"
        localField: 'service', // Field in the QueuePatients collection
        foreignField: '_id', // Field in the services collection
        as: 'service', // Alias for the joined documents
      },
    },
    {
      $unwind: '$service',
    },
  ]);
  if (result.length === 0) {
    return next(new AppError('No patient found with that name or phone number', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});
