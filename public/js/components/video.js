import axios from 'axios';
import Swal from 'sweetalert2';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const sendVideo = async fd => {
  try {
    NProgress.start();
    const res = await axios({
      method: 'post',
      url: '/api/v1/video/upload',
      data: fd,
      onUploadProgress: progressEvent => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        NProgress.set(progress / 100);
      },
    });
    NProgress.done();
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.reload();
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.response.data.message,
    });
  }
};
export const deleteVideoAxios = async id => {
  try {
    const res = await axios({
      method: 'delete',
      url: '/api/v1/video/delete/' + id,
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err,
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
