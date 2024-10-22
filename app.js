const path = require('path');
const express = require('express');
const compression = require('compression');
const cookies = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./Middleware/errorController');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  express.static(path.join(__dirname, 'public'), {
    // maxAge: '30d', // Cache files for 30 days
  }),
);

app.use(cookies());

app.use(bodyParser.json());

helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
});

app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.use(cors());
app.use(compression());

// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);

//routes config
const userRoutes = require('./src/user/userRoutes');
const serviceRoutes = require('./src/services/serviceRoutes');
const doctorScheduleRoutes = require('./src/doctorSchedule/doctorScheduleRoutes');
const roomRoutes = require('./src/room/roomRoutes');
const bookingRoutes = require('./src/booking/bookingRoutes');
const inventoryRoutes = require('./src/inventory/inventoryRoutes');
const invoiceRoutes = require('./src/invoice/invoiceRoutes');
const paymentRoutes = require('./src/payment/paymentRoutes');
const patientRecordRoutes = require('./src/patientRecord/patientRecordRoutes');
const patientRoutes = require('./src/patient/patientRoutes');
const preSetRoutes = require('./src/preSet/preSetRoutes');
const statisticsRoutes = require('./src/statistics/statisticsRoutes');
const PreScriptionRoutes = require('./src/prescription/PreScriptionRoutes');
const noteRoutes = require('./src/note/noteRoutes');
const videoRoutes = require('./src/video/videoRoutes');
const viewRoutes = require('./src/view/viewRoutes');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctorSchedule', doctorScheduleRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

app.use('/api/v1/note', noteRoutes);
app.use('/api/v1/service', serviceRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/preSetRoutes', preSetRoutes);
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/patient/patientRecord', patientRecordRoutes);
app.use('/api/v1/Prescription', PreScriptionRoutes);

app.use('/', viewRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
