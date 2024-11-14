const patientForm = document.querySelector('#patientForm');
import axios from 'axios';
import Swal from 'sweetalert2';

if (patientForm) {
  patientForm.addEventListener('submit', async e => {
    e.preventDefault();

    try {
      const patient = {};
      patient.name = document.getElementById('name').value;
      patient.sex = document.getElementById('sex').value;
      patient.birthDate = document.getElementById('birthDate').value;
      patient.age = document.getElementById('age').value;
      patient.phoneNumber = document.getElementById('phoneNumber').value;
      patient.secondNumber = document.getElementById('secondNumber').value;
      patient.address = document.getElementById('address').value;
      patient.maritalStatus = document.getElementById('maritalStatus').value;
      patient.occupation = document.getElementById('occupation').value;
      patient.country = document.getElementById('pCountry').value;

      const res = await axios.post('/api/v1/patient', patient);
      if (res.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Patient added successfully',
        });
        window.setTimeout(() => {
          location.reload();
        }, 1500);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      });
    }
  });
}
if (document.getElementById('searchForm')) {
  document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission

    // Capture the search input value
    const searchQuery = document.getElementById('search').value;

    // Build the URL with the search query as a parameter
    const url = `http://127.0.0.1:8000/patientList?search=${encodeURIComponent(searchQuery)}`;

    // Redirect to the URL
    window.location.href = url;
  });
}
