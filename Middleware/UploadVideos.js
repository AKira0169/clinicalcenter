require('dotenv').config({ path: './config.env' });

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Upload } = require('@aws-sdk/lib-storage');
const { PassThrough } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { s3 } = require('../config/s3Config');

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fsPromises = fs.promises;

ffmpeg.setFfmpegPath(ffmpegPath);

const processAndUploadVideo = folder => async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ status: 'Error', message: 'No file uploaded' });
  }

  let responseSent = false; // Track if the response has been sent

  try {
    const clinicID = req.user.clinicID._id.toString();

    const uniqueId = uuidv4();
    const fileNameWithoutExtension = req.file.originalname.split('.')[0];
    const fileExtension = 'mp4'; // Convert to mp4
    const clinicIdPrefix = `${clinicID}/`; // Prefix with ClinicID
    const fileKey = `${folder}/${clinicIdPrefix}${fileNameWithoutExtension}-${uniqueId}.${fileExtension}`;

    // Create the directory if it doesn't exist
    const directoryPath = path.join(__dirname, 'public', 'temp');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Save the buffer to a temporary file
    const tempFilePath = path.join(directoryPath, `${fileNameWithoutExtension}-${uniqueId}-input.mp4`);
    const tempOutputFilePath = path.join(directoryPath, `${fileNameWithoutExtension}-${uniqueId}-output.mp4`);
    await fsPromises.writeFile(tempFilePath, req.file.buffer);
    console.log('Temporary file created:', tempFilePath);

    // Use FFmpeg to process the video
    ffmpeg(tempFilePath)
      .outputOptions('-c:v', 'libx264') // Set video codec
      .outputOptions('-crf', '28') // Set Constant Rate Factor
      .format('mp4') // Set format
      .on('start', commandLine => {
        console.log('FFmpeg command line:', commandLine);
      })
      .on('end', async () => {
        console.log('FFmpeg processing finished');

        // Create a PassThrough stream for S3 upload
        const passThrough = new PassThrough();

        // Set up the S3 upload parameters
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          Body: passThrough,
          ACL: 'private', // Adjust as needed
          Tagging: `ClinicID=${clinicID}`, // Tag the file with the clinic's ID
        };

        // Start the S3 upload in the background
        const uploadPromise = new Upload({
          client: s3,
          params: uploadParams,
        }).done();

        // Pipe the output of FFmpeg to the PassThrough stream
        fs.createReadStream(tempOutputFilePath).pipe(passThrough);

        // Wait for the S3 upload to complete
        await uploadPromise;

        // Cleanup temporary files
        await fsPromises.unlink(tempFilePath);
        await fsPromises.unlink(tempOutputFilePath);

        req.file.s3Key = fileKey; // Attach S3 key to the request object for further processing
        next();
      })
      .on('error', err => {
        console.error('FFmpeg error:', err.message || err);
        if (!responseSent) {
          res.status(500).json({ status: 'Error', message: err.message || 'Something went wrong' });
          responseSent = true; // Prevent multiple responses
        }
      })
      .on('stderr', stderr => {
        console.error('FFmpeg stderr:', stderr);
      })
      .save(tempOutputFilePath); // Save the output to a temporary file
  } catch (error) {
    console.error('Error processing or uploading video:', error.message || error);
    if (!responseSent) {
      res.status(500).json({ status: 'Error', message: error.message || 'Something went wrong' });
      responseSent = true; // Prevent multiple responses
    }
  }
};

module.exports = { processAndUploadVideo };
