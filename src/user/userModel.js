const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validate = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter a email address'],
      unique: true,
      lowercase: true,
      validate: [validate.isEmail, 'Please provide a valid email address'],
    },
    emailChangedAt: Date,
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['secretary', 'admin', 'nurse', 'doctor'],
      default: 'secretary',
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === 'doctor'; // This field is required only if the role is 'doctor'
      },
      validate: {
        validator: function (val) {
          return this.role !== 'doctor' || (val && val.length > 0); // Ensure specialization is provided if role is 'doctor'
        },
        message: 'Please provide a specialization for the doctor',
      },
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minLength: 8,
      select: false,
    },
    typeOfRecord: {
      type: Boolean,
      default: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: `Passwords doesn't match`,
      },
    },
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordResetExpires: Date,
    verifyToken: String,
    verifyTokenExpires: Date,
    verifiedAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password' || this.isNew)) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctpassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.methods.createPasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordRestToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
