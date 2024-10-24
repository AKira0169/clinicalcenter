import axios from 'axios';
import Swal from 'sweetalert2';

const inventoryForm = document.getElementById('inventoryForm');

if (inventoryForm) {
  inventoryForm.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const body = new FormData(inventoryForm);

      const res = await axios.post('/api/v1/inventory', body);
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
  });
}
