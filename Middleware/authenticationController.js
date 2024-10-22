const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../src/user/userModel');
const Email = require('../utils/Email');
const { generatePresignedUrl } = require('../utils/generatePresignedUrl');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  const token = signToken(user._id);
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({ status: 'success', token, date: { user } });
};

exports.signUp = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(user, 201, res);
});
exports.logout = (req, res) => {
  res.clearCookie('jwt'); // This deletes the 'jwt' cookie

  res.status(200).json({ status: 'success' });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Invalid email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctpassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});
exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }
  createSendToken(user, 200, res);
});
exports.deleteUserById = catchAsync(async (req, res, next) => {
  // Find the user by ID and delete it
  const user = await User.findByIdAndDelete(req.params.id);

  // If no user found with the provided ID, return an error
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // If user deleted successfully, send a success response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //step one get the token check if it there
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('you are not logged in! please loging to gain access', 401));
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if the user is still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belongs to this token does no longer exist', 401));
  }
  //check if the user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('The user IS RECENTLY CHANGED HIS PASSWORD! PLEASE LOGIN AGAIN', 401));
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    //1) verify token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    //2) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.redirect('/login');
    }
    //3) check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.redirect('/login');
    }
    //4) there is a logged in user
    req.user = currentUser;
    req.user.photo = await generatePresignedUrl(currentUser.photo);
    res.locals.user = currentUser;
    return next();
  }
  return res.redirect('/login');
});

exports.restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to preform this action', 403));
    }
    next();
  };
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the colection
  const user = await User.findById(req.user.id).select('+password');

  // chech if the posted password is correct
  if (!(await user.correctpassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  // if so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //log the user in, send the JSONWEBTOKEN'
  createSendToken(user, 200, res);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  if (!user.verified) {
    return next(new AppError('this account is not verified', 401));
  }
  //generate a random token
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });
  // send it to user
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    user.passwordRestToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email.Try again later!'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordRestToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token is not expired , and there is user , set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired'), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update changepasssowrdAt proparty for the user

  //log the user in, send the JSONWEBTOKEN'JWT'
  createSendToken(user, 200, res);
});
exports.loginFailedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 failed login attempts per windowMs
  skipSuccessfulRequests: true, // skip successful requests from rate limiting
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again later', 429));
  },
});

exports.emailResetLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  handler: (req, res, next) => {
    next(new AppError('Too many email reset attempts, please try again later.', 429));
  },
});

exports.emailVerifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2, // limit each IP to 2 attempts per windowMs
  handler: (req, res, next) => {
    next(new AppError('Too many email reset attempts, please try again later.', 429));
  },
});

exports.sendVerifyCode = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // Generate a cryptographically secure verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Store the token and its expiration time in the user document
  user.verifyToken = verificationToken;
  user.verifyTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

  await user.save({ validateBeforeSave: false });

  // Construct verification URL with the token
  const verifyURL = `${req.protocol}://${req.get('host')}/api/v1/user/verifyemail/${verificationToken}`;

  // Send verification email
  await new Email(user, verifyURL).sendverifyToken();

  res.status(200).json({
    status: 'success',
    message: 'Verification link sent to your email',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  // Find user by verification token
  const user = await User.findOne({ verifyToken: req.params.token });

  if (!user) {
    return next(new AppError('Invalid or expired verification link', 401));
  }

  // Check if the verification token has expired
  if (user.verifyTokenExpires < Date.now()) {
    return next(new AppError('Verification link has expired', 401));
  }

  // Mark the user as verified and clear the verification token
  user.verified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.redirect('/');
});
