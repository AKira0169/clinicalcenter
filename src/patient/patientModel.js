const mongoose = require('mongoose');

const slugify = require('slugify');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient must have a name'],
      trim: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    sex: {
      type: String,
      enum: ['Male', 'Female'],
      required: [true, 'Patient must have a sex'],
    },
    birthDate: {
      type: Date,
      required: [true, 'Patient must have a Birth Date'],
    },
    age: {
      type: Number,
      required: [true, 'Patient must have an age'],
    },
    idNo: {
      type: String,
      // default: 'No data found',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Patient must have a Phone number'],
    },
    secondNumber: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Patient must have an area'],
    },
    occupation: {
      // type: Boolean,
      type: String,

      default: 'No data found',
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Engaged', 'Married', 'Divorced', 'Widowed'],
      required: [true, 'Must specify the Marital Status'],
    },
    country: {
      type: String,
    },
    serial: {
      type: String,
      required: true,
      unique: true,
    },

    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);
patientSchema.index({ name: 'text', serial: 1, phoneNumber: 1 }, { unique: true });

patientSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

patientSchema.post(/^find/, async (result, next) => {
  const today = new Date();

  try {
    if (!Array.isArray(result)) {
      const patient = result instanceof mongoose.Document ? result.toObject() : result;
      let age = today.getFullYear() - patient.birthDate.getFullYear();
      if (
        today.getMonth() < patient.birthDate.getMonth() ||
        (today.getMonth() === patient.birthDate.getMonth() && today.getDate() < patient.birthDate.getDate())
      ) {
        age -= 1;
      }
      patient.age = age;

      // Update the document with the calculated age
      await Patient.updateOne({ _id: patient._id }, { $set: { age: patient.age } });
    } else {
      // If 'result' is an array of documents
      await Promise.all(
        result.map(async patient => {
          let age = today.getFullYear() - patient.birthDate.getFullYear();
          if (
            today.getMonth() < patient.birthDate.getMonth() ||
            (today.getMonth() === patient.birthDate.getMonth() && today.getDate() < patient.birthDate.getDate())
          ) {
            age -= 1;
          }
          patient.age = age;

          // Update each document with the calculated age
          await Patient.updateOne({ _id: patient._id }, { $set: { age: patient.age } });
        }),
      );
    }

    next();
  } catch (err) {
    console.error('Error updating patient with age:', err);
    next(err); // Pass the error to the next middleware or callback
  }
});

patientSchema.virtual('patientRecord', {
  ref: 'PatientRecord',
  foreignField: 'patient',
  localField: '_id',
});

patientSchema.virtual('note', {
  ref: 'Note',
  foreignField: 'patient',
  localField: '_id',
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
