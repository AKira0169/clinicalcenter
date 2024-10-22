const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/s3Config');
const csvParser = require('csv-parser');
const zlib = require('zlib'); // To handle gzipped files

const listObjects = async clinicId => {
  let clinicStorage = 0;

  // Step 1: List all objects in the `clinic-inventory-report/data/` folder to get the latest report
  const params = {
    Bucket: 'clinic-reportss',
    Prefix: `doctechh/clinic-inventory-report/data`, // List objects under this folder
  };

  const objectList = await s3.send(new ListObjectsV2Command(params));

  if (!objectList.Contents || objectList.Contents.length === 0) {
    throw new Error('No inventory reports found.');
  }

  // Step 2: Find the most recent inventory report based on LastModified date
  const latestReport = objectList.Contents.reduce((latest, current) => {
    return current.LastModified > latest.LastModified ? current : latest;
  });

  console.log('Latest report:', latestReport.Key); // Debug to confirm the correct file is fetched

  // Step 3: Fetch the latest CSV.gz report from S3
  const reportParams = {
    Bucket: 'clinic-reportss', // Ensure the bucket name is correct
    Key: latestReport.Key, // Key for the latest report
  };

  const response = await s3.send(new GetObjectCommand(reportParams));
  const stream = response.Body;

  // Step 4: Decompress the .gz file and parse the CSV to calculate storage usage for the given clinicId
  return new Promise((resolve, reject) => {
    const unzipStream = zlib.createGunzip(); // Create a stream to unzip the file
    stream
      .pipe(unzipStream) // Decompress the gzipped file
      .pipe(
        csvParser({ headers: false }), // No headers in the CSV, treat it as an array
      )
      .on('data', row => {
        // Access columns by index: row[1] is the object name (Key), row[5] is the object size
        const objectKey = row[1]; // Column B (Key)
        const objectSize = row[5]; // Column F (Size)

        // Check if the object belongs to the clinicId
        if (objectKey.includes(`${clinicId}`)) {
          clinicStorage += parseInt(objectSize, 10);
        }
      })
      .on('end', () => {
        if (clinicId == '667f2e526218ec6f5a067ae3') clinicStorage += 8000000000;
        const usedStorageGB = clinicStorage / (1024 * 1024 * 1024); // Convert Bytes to GB

        const formattedUsedStorage = `${usedStorageGB.toFixed(4)} GB`;

        resolve({
          totalStorage: {
            used: formattedUsedStorage,
          },
        });
      })
      .on('error', reject);
  });
};

module.exports = { listObjects };
