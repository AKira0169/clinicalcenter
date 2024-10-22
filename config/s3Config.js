require('dotenv').config({ path: './config.env' });
const { S3Client } = require('@aws-sdk/client-s3');

// Configure AWS S3
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});
module.exports = { s3 };
