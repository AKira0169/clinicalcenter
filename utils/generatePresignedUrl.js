// const { GetObjectCommand } = require('@aws-sdk/client-s3'); // Use S3 module for GetObjectCommand
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const { s3 } = require('../config/s3Config'); // S3 configuration, not CloudFront

// const generatePresignedUrl = async fileKey => {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileKey,
//     });

//     // Generate the presigned URL using the S3 client
//     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//     console.log('Generated S3 URL:', url);

//     // Replace S3 URL with CloudFront URL
//     const cloudFrontUrl = url.replace(
//       `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
//       'https://d2kwry6u37ac01.cloudfront.net/',
//     );

//     return cloudFrontUrl;
//   } catch (error) {
//     console.error('Error generating presigned URL:', error.message || error);
//     throw error;
//   }
// };

// module.exports = { generatePresignedUrl };
// Function to generate a CloudFront URL
const generatePresignedUrl = fileKey => {
  const cloudFrontUrl = `https://d2kwry6u37ac01.cloudfront.net/${fileKey}`;
  return cloudFrontUrl;
};

module.exports = { generatePresignedUrl };
