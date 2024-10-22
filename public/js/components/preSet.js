import axios from 'axios';
import Swal from 'sweetalert2';

export const createPreSet = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/preSetRoutes',
      data: fd,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const deletePreSet = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/preSetRoutes/${id}`,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.assign('/preset/medication');
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const updatePreSet = async (preSet, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/preSetRoutes/${id}`,
      data: preSet,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
    });
  }
};
