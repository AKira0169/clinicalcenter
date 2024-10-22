import axios from 'axios';
import Swal from 'sweetalert2';

export const createInvoice = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/invoice',
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

export const deleteInvoiceById = async id => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/invoice/deleteInvoice/${id}`,
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
export const printInvoices = async fd => {
  try {
    const res = await axios({
      method: 'post',
      url: `/api/v1/invoice/printInvoices`,
      data: fd,
      responseType: 'blob', // Ensure the response is treated as a Blob for file download
    });

    if (res.status === 200) {
      // Trigger file download in the browser
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoices.csv'; // Set the download file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Show success message
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your invoices have been downloaded',
        showConfirmButton: false,
        timer: 1500,
      });
    }

    return res;
  } catch (err) {
    // Handle errors and display a message
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.response?.data?.message || 'An error occurred',
      showConfirmButton: false,
      timer: 2500,
    });
  }
};
export const createDiscount = async (fd, id) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/invoice/discount/' + id,
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
