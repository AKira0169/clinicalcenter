import axios from 'axios';
import Swal from 'sweetalert2';

export const sendNewScale = async (formData, id) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/patient/patientRecord/createPatientScale/' + id,
      data: formData, // Send formData directly without wrapping it in an object
    });
    if (res.data.status === 'success') {
      if (res.data.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          location.assign(`/patientMedicalView/${id}`);
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }
};
