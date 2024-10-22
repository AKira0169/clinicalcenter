const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    video: {
      type: String,
      required: true,
    },
    date: Date,
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'The record must belong to a patient'],
    },
  },
  { timestamps: true },
);

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
