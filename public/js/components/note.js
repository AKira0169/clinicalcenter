import axios from 'axios';
import Swal from 'sweetalert2';

export const createNote = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/note',
      data: fd,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.assign(`/patientMedicalView/${fd.get('patient')}`);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

export const deleteNote = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/note/${id}`,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.reload();
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const updateNote = async (id, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/note/${id}`,
      data: data,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.assign(`/patientMedicalView/${res.data.data.patient}`);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
