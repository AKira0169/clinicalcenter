const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

const Patient = require('../src/patient/patientModel');

const PatientRecord = require('../src/patientRecord/patientRecordModel');

const filterOutput = data => {
  return data.map(result => {
    const filteredResult = Object.entries(result._doc).reduce((acc, [key, value]) => {
      if (!Array.isArray(value) || value.length > 0) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return filteredResult;
  });
};

exports.search = catchAsync(async (req, res, next) => {
  // const selectedFields = [];
  const searchFields = [
    'examination.title',
    'pastRadiology.title',
    'currentMedications.title',
    'complaints.title',
    'diagnose',
    'DMD.Type',
  ];
  let query = {};

  const andConditions = req.body.keywords.map(keyword => {
    const orConditions = searchFields.map(field => ({
      [field]: { $regex: new RegExp(`\\b${keyword}\\b`, 'i') },
    }));
    return { $or: orConditions };
  });

  const results = await PatientRecord.find({
    $and: andConditions,
  }).populate('patient');

  const filteredData = filterOutput(results);

  res.status(200).json({
    status: 'success',
    results: filteredData.length,
    filteredData,
  });
});

exports.testgamed = catchAsync(async (req, res, next) => {
  const fields = [
    'examination.title',
    'pastRadiology.title',
    'currentMedications.title',
    'complaints.title',
    'diagnose',
  ];
  const searchTerms = ['game', 'game', 'game', 'game', 'game'];

  const matchStages = [];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const searchTerm = searchTerms[i];

    const matchStage = {
      $match: {
        [field]: searchTerm,
      },
    };

    matchStages.push(matchStage);
  }

  const searchResults = await PatientRecord.aggregate([
    ...matchStages,
    {
      $project: {
        _id: 0,
      },
    },
  ]);
});

exports.testadvsearch = catchAsync(async (req, res, next) => {
  try {
    const { searchField, searchElements } = req.body;
    const userClinic = req.user.clinic; // Assuming req.user.clinic contains clinic information

    const patientIdsWithElements = await Promise.all(
      searchField.map(async (field, index) => {
        const result = await PatientRecord.find(
          {
            $and: [
              { clinic: userClinic }, // Filter by user's clinic
              {
                [`${field}.title`]: {
                  $regex: new RegExp(searchElements[index], 'i'),
                },
              },
            ],
          },
          'patient',
        );
        return result.map(record => record.patient.toString());
      }),
    );

    let patientIds = [];
    if (patientIdsWithElements.length > 0) {
      patientIds = patientIdsWithElements.reduce((acc, val) => {
        if (acc.length === 0) {
          return val;
        }
        return acc.filter(patientId => val.includes(patientId));
      });
    }

    const patients = await Patient.find({
      $and: [
        { _id: { $in: patientIds } },
        { clinic: userClinic }, // Additional filter for clinic
      ],
    }).populate('patientRecord');

    res.status(200).json({
      status: 'success',
      data: { patients, length: patients.length },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
});

//the old test advanced search
// exports.testadvsearch = catchAsync(async (req, res, next) => {
//   try {
//     const { searchField, searchElements } = req.body;

//     const patientIdsWithElements = await Promise.all(
//       searchField.map(async (field, index) => {
//         const result = await PatientRecord.find(
//           {
//             [`${field}.title`]: {
//               $regex: new RegExp(searchElements[index], 'i'),
//             },
//           },
//           'patient',
//         );
//         return result.map((record) => record.patient.toString());
//       }),
//     );

//     let patientIds = [];
//     if (patientIdsWithElements.length > 0) {
//       patientIds = patientIdsWithElements.reduce((acc, val) => {
//         if (acc.length === 0) {
//           return val;
//         }
//         return acc.filter((patientId) => val.includes(patientId));
//       });
//     }

//     const patients = await Patient.find({
//       _id: { $in: patientIds },
//     }).populate('patientRecord');

//     res.status(200).json({
//       status: 'success',
//       data: patients,
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       status: 'Error',
//       message: error.message,
//     });
//   }
// });

// const keywordPattern = req.body.keywords
//   .map((keyword) => `\\b${keyword}\\b`)
//   .join('|');

// for (let field of searchFields) {
//   query = { $regex: new RegExp(keywordPattern, 'i') };
//   selectedFields.push({ [field]: query });
// }

// const patientIds = await PatientRecord.distinct('patient', {
//   $or: andConditions,
// });

// // const filteredPatients = [];

// // for (const patientId of patientIds) {
// //   const patientRecords = await PatientRecord.find({ patient: patientId });
// //   // Check if all keywords are present in at least one record
// //   const allKeywordsFound = req.body.keywords.every((keyword) => {
// //     // console.log('keyword: ', keyword);
// //     return patientRecords.some((record) => {
// //       console.log('record: ', record._id);
// //       return searchFields.some((field) => {
// //         // console.log('field: ', field);
// //         const fieldValue = record[field];
// //         // console.log('value: ', fieldValue);
// //         return (
// //           (fieldValue &&
// //             fieldValue.match(new RegExp(`\\b${keyword}\\b`, 'i'))) ||
// //           false
// //         );
// //       });
// //     });
// //   });

// //   if (allKeywordsFound) {
// //     filteredPatients.push(...patientRecords);
// //   }
// // }
// const filterOutput = (data) => {
//   return data.map((result) => {
//     const filteredResult = { ...result._doc };

//     for (const key in filteredResult) {
//       if (
//         Array.isArray(filteredResult[key]) &&
//         filteredResult[key].length === 0
//       ) {
//         delete filteredResult[key];
//       }
//     }
//     return filteredResult;
//   });
// };
