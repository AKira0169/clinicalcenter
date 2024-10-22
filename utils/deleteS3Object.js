const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/s3Config');

// Function to delete an object from S3
const deleteS3Object = async fileKey => {
  try {
    // Create the delete command
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME, // Ensure AWS_BUCKET_NAME is set in your environment variables
      Key: fileKey, // S3 key (path) of the image to delete
    });

    // Send the delete command to S3
    await s3.send(deleteCommand);
    console.log(`Successfully deleted ${fileKey} from S3`);
  } catch (error) {
    console.error('Error deleting object from S3:', error.message || error);
    throw error; // Re-throw the error for further handling if needed
  }
};

module.exports = { deleteS3Object };
