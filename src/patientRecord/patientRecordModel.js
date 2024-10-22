const mongoose = require('mongoose');

const PatientRecordSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  diagnose: { title: String, dateOfOnSet: Date, dateOfDignosis: Date },
  complaints: [
    {
      title: String,
      comment: String,
    },
  ],
  familyHistory: [
    {
      title: String,
      comment: String,
    },
  ],
  pastMedicalHistories: [
    {
      title: String,
      comment: String,
    },
  ],
  presentMedicalHistories: [
    {
      title: String,
      comment: String,
    },
  ],
  examination: [
    {
      title: String,
      comment: String,
    },
  ],
  vitalInformation: [
    {
      title: String,
      comment: String,
      weight: String,
      height: String,
      bloodPressure: String,
      pulseRate: String,
      temperature: String,
      respirationRate: String,
      oxygenSaturation: String,
      bloodSugar: String,
      date: Date,
    },
  ],
  pastRadiology: [
    {
      title: String,
      comment: String,
      date: Date,
      img: [String],
    },
  ],
  pastlabtests: [
    {
      title: String,
      comment: String,
    },
  ],
  requestRadiology: [
    {
      title: String,
      comment: String,
    },
  ],
  DMD: [
    {
      Type: String,
      description: String,
      startedAt: Date,
      onGoing: Boolean,
      endedAt: Date,
      causeOfDC: String,
      adherence: {
        status: String,
        dc: String,
        why: String,
      },
      adverseEvents: {
        clinic: String,
        labs: String,
      },
    },
  ],
  currentMedications: [
    {
      title: String,
      description: String,
      startedAt: Date,
      endedAt: Date,
    },
  ],
  clinic: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Please enter a clinic'],
  },
  plan: String,
  note: String,
});
// PatientRecordSchema.index({ pastRadiology: 'text' });
PatientRecordSchema.index({ diagnose: 1 }, { currentMedications: 1 });

const PatientRecord = mongoose.model('PatientRecord', PatientRecordSchema);

module.exports = PatientRecord;
