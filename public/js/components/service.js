import axios from 'axios';
import Swal from 'sweetalert2';

export const createServices = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/service',
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
export const updateServices = async (id, fd) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/service/' + id,
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
export const deleteServices = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/service/${id}`,
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
