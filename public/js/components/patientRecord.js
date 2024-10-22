import axios from 'axios';
import Swal from 'sweetalert2';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const createPatientRecord = async (fd, serial) => {
  const maxRetries = 1;
  let retryCount = 0;

  const submitRequest = async () => {
    NProgress.start();
    try {
      const res = await axios({
        method: 'POST',
        url: `/api/v1/patient/patientRecord/createPatientRecord/${serial}`,
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
          title: 'Patient Record Created Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        window.setTimeout(() => {
          location.assign(`/patient/${serial}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting request:', err);

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... (Attempt ${retryCount}/${maxRetries})`);
        setTimeout(submitRequest, 1000); // Retry after 1 second
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  };

  submitRequest();
};
export const createPatientRecordNew = async (formdata, serial) => {
  const maxRetries = 1;
  let retryCount = 0;

  const submitRequest = async () => {
    try {
      NProgress.start();
      const res = await axios({
        method: 'POST',
        url: `/api/v1/patient/patientRecord/createPatientRecordNew/${serial}`,
        data: formdata,
        onUploadProgress: progressEvent => {
          // Log the upload progress to the console
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
          location.assign(`/patientMedicalView/${serial}`);
        });
      }
    } catch (err) {
      console.error('Error submitting request:', err);

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... (Attempt ${retryCount}/${maxRetries})`);
        setTimeout(submitRequest, 1000); // Retry after 1 second
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  };

  submitRequest();
};
export const editPatientRecordNew = async (formdata, serial) => {
  const maxRetries = 1;
  let retryCount = 0;
  const submitRequest = async () => {
    try {
      NProgress.start();

      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/patient/patientRecord/editPatientRecordNew/${serial}`,
        data: formdata,
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
          location.assign(`/patientMedicalView/${res.data.editedrecord.patient}`);
        });
      }
    } catch (err) {
      console.error('Error submitting request:', err);

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... (Attempt ${retryCount}/${maxRetries})`);
        setTimeout(submitRequest, 1000); // Retry after 1 second
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    }
  };

  submitRequest();
};
export const deleteRecordPatient = async serial => {
  try {
    const res = await axios({
      method: 'delete',
      url: '/api/v1/patient/patientRecord/deletePatientRecord/' + serial,
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

export const sendMRI = async formData => {
  try {
    NProgress.start();
    const res = await axios({
      method: 'post',
      url: '/api/v1/patient/patientRecord/sendMRI',
      data: formData, // Send formData directly without wrapping it in an object
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
      text: 'Something went wrong!',
    });
  }
};
export const DeleteFilesMri = async id => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/patient/patientRecord/deletePatientFile/${id}`,
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'The file has been deleted successfully',
      showConfirmButton: false,
      timer: 2500,
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }
};

export const EditPatientRecord = async (fd, serial, ser) => {
  try {
    NProgress.start();
    const res = await axios({
      method: 'patch',
      url: `/api/v1/patient/patientRecord/updatePatientRecord/${serial}`,
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
        timer: 1500,
      });
      window.setTimeout(() => {
        location.assign(`/patient/${ser}`);
      }, 1500);
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }
};
