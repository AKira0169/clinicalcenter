const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/s3Config');

const processAndUploadImages = folder => async (req, res, next) => {
  // Collect files into an array from req.file and req.files
  const files = req.file ? [req.file] : req.files;

  // Check if there are no files to process
  if (!files || files.length === 0) {
    console.log('No files uploaded');
    return next();
  }

  try {
    // Process each file in the array
    const uploadPromises = files.map(async file => {
      const clinicID = req.user.clinicID._id.toString();
      const uniqueId = uuidv4();
      const fileNameWithoutExtension = file.originalname.split('.')[0];
      const fileExtension = 'jpg'; // Convert to jpg or keep the original extension
      // Create a file key with ClinicID as a prefix
      const clinicIdPrefix = `${clinicID}/`; // Prefix with ClinicID
      const fileKey = `${folder}/${clinicIdPrefix}${fileNameWithoutExtension}-${uniqueId}.${fileExtension}`;

      // Resize the image and reduce its quality
      const imageBuffer = await sharp(file.buffer)
        .jpeg({ quality: 50 }) // Adjust quality as needed
        .toBuffer();

      // Upload the image to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          Body: imageBuffer,
          ACL: 'private', // Adjust as needed
          CacheControl: 'max-age=31536000', // Cache for 1 year,
          Tagging: `ClinicID=${clinicID}`, // Tag the file with the clinic's ID
        }),
      );

      return fileKey; // Return the S3 key of the uploaded file
    });

    // Wait for all upload promises to complete
    const uploadedFileKeys = await Promise.all(uploadPromises);

    // Attach S3 keys to the request object for further processing
    if (req.file) {
      // For single file uploads
      req.file.s3Key = uploadedFileKeys[0];
    } else {
      // For multiple file uploads
      req.files.s3Keys = uploadedFileKeys;
    }

    next();
  } catch (error) {
    console.error('Error processing or uploading images:', error.message || error);
    res.status(500).json({ status: 'Error', message: error.message || 'Something went wrong' });
  }
};

module.exports = { processAndUploadImages };
