import axios from 'axios';
import Swal from 'sweetalert2';

export const createNewUser = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/user/signup',
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
        location.assign('/');
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const restartEmail = async email => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/user/forgotPassword',
      data: email,
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'we sent an a token for your email',
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.log(error);
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: error.response ? error.response.data.message : 'An error occurred during login',
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const confrestartEmail = async (url, data) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `/api/v1/user/resetPassword/${url}`,
      data: data,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'we sent an a token for your email',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.assign('/');
      });
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: error.response ? error.response.data.message : 'An error occurred during login',
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const updateuserHorzantel = async data => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateuserHorzantel',
      data: { data },
    });
    if (res.data.status === 'success') {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};
export const DeleteUser = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/user/deleteUser/${id}`,
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    console.log(err);
  }
};
export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/v1/user/login', {
      email,
      password,
    });

    const { token } = response.data; // Assuming the token is present in the response data

    if (!token) {
      // Handle case where token is not present in response
      throw new Error('Token not found in response');
    }

    // Store the token securely (e.g., in local storage)
    localStorage.setItem('token', token);

    // Set the default Authorization header for all Axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      title: 'Signed in successfully',
    });
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
    // Redirect or perform actions after successful login
  } catch (error) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: error.response ? error.response.data.message : 'An error occurred during login',
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/user/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err);
  }
};

export const verifyEmail = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/user/sendVerifyCode',
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'we sent a token for your email',
        showConfirmButton: false,
        timer: 2000,
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

export const updateMe = async (formData, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/user/updateUser/${id}`,
      data: formData,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.reload(true);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.reload(true);
    });
  }
};
export const updatePassword = async (formData, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/user/updateMyPassword/${id}`,
      data: formData,
    });
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        location.reload(true);
      });
    }
  } catch (err) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response.data.message,
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.reload(true);
    });
  }
};

/* 

    const ToastNotification = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: false,
    });
    ToastNotification.fire({
      icon: 'info',
      title: 'You have New Notification',
    });

    
*/

export const refreshToken = async () => {
  try {
    const response = await axios.get('/api/v1/user/refresh-token');
    console.log(response.data);

    const { token } = response.data; // Assuming the token is present in the response data

    if (!token) {
      // Handle case where token is not present in response
      throw new Error('Token not found in response');
    }

    // Store the token securely (e.g., in local storage)
    localStorage.setItem('token', token);

    // Set the default Authorization header for all Axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.log(error);
  }
};
