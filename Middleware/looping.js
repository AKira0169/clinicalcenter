// const statisticsController = require('../src/statistics/statisticsController');
// const User = require('../src/user/userModel');

// exports.loopingmidnight = async (req, res, next) => {
//   try {
//     const allUsers = await User.find().lean();

//     // Extract all clinic names from users
//     const clinicNames = allUsers.map(user => user.clinicID).filter(clinicID => clinicID !== undefined);

//     console.log(clinicNames);

//     // Use Set to ensure uniqueness and remove duplications
//     const uniqueClinicNames = [...new Set(clinicNames.map(id => id.toString()))];
//     console.log('uniqueClinicNames:', uniqueClinicNames);
//     async function processClinics() {
//       for (const clinicName of uniqueClinicNames) {
//         await statisticsController.patientCount({ user: { clinicID: clinicName }, bypassing: true }, res, next);
//         await statisticsController.trackingVisits({ user: { clinicID: clinicName }, bypassing: true }, res, next);
//       }
//     }

//     processClinics(); // Call the function to start processing
//   } catch (err) {
//     console.log(err);
//   }
// };
