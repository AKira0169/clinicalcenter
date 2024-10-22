import axios from 'axios';
import Swal from 'sweetalert2';

let isSending = false; // Flag to track if API call is already in progress

export const addnewpatient = async patient => {
  try {
    // Check if API call is already in progress
    if (isSending) {
      return; // If yes, exit the function to prevent multiple calls
    }

    // Set the flag to indicate API call is in progress
    isSending = true;

    const res = await axios({
      method: 'POST',
      url: '/api/v1/patient',
      data: { patient },
    });

    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.assign(`/`);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err,
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.assign(`/`);
    });
  } finally {
    // Reset the flag once API call is complete (whether success or failure)
    isSending = false;
  }
};

export const updatePatient = async (patient, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/patient/update-patient/' + id,
      data: patient,
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'The patient has been updated.',
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.assign('/patientMedicalView/' + res.data.data.id);
    });
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err,
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.reload(true);
    });
  }
};
