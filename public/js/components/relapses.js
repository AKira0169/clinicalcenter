import axios from 'axios';
import Swal from 'sweetalert2';

export const createNewRelapse = async (formData, patient, sarial) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/relapses`,
      data: {
        formData,
        patient,
      },
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'The relapse has been created.',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.assign(`/patientMedicalView/${patient}`);
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const DeleteRelapse = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/relapses/deleteRelapse/${id}`,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'The patient has been updated.',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.reload();
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const upDateRelapceAxios = async (formData, id, sarial) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/relapses/updateRelapse/${id}`,
      data: formData,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'The patient has been updated.',
        showConfirmButton: false,
        timer: 2500,
      });
      window.setTimeout(() => {
        location.assign(`/patientMedicalView/${sarial}`);
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};
