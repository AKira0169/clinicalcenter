import axios from 'axios';
import Swal from 'sweetalert2';

const loginForm = document.getElementById('loginForm');
const Logoutbtn = document.querySelector('.Logoutbtn');

if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const body = { email, password };
      const res = await axios.post('/api/v1/user/login', body);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'success',
        title: 'You have successfully logged in',
      });
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } catch (err) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
    }
  });
}
if (Logoutbtn) {
  Logoutbtn.addEventListener('click', async e => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'get',
        url: '/api/v1/user/logout',
      });

      if (res.data.status === 'success') {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: toast => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'You have successfully logged out',
        });
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    } catch (err) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
    }
  });
}
