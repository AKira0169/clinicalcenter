import axios from 'axios';
import Swal from 'sweetalert2';

const specializationSelection = document.querySelector('.specializationSelection');
const doctorSelection = document.querySelector('.doctorSelection');
const dateSelection = document.querySelector('.dateSelection');
const timeSelection = document.querySelector('.timeSelection');
const bookingForm = document.querySelector('.bookingForm');

if (specializationSelection) {
  specializationSelection.addEventListener('click', async e => {
    e.preventDefault();
    const specialization = specializationSelection.value;

    const data = await axios.get(`/api/v1/user/specialization/${specialization}`);
    const users = data.data.data.users;

    doctorSelection.innerHTML = '<option selected>Open this select menu</option>';
    users.forEach(user => {
      const opt = document.createElement('option');
      opt.value = user._id;
      opt.innerHTML = user.name;
      doctorSelection.appendChild(opt);
    });
  });
}

if (doctorSelection) {
  doctorSelection.addEventListener('change', async e => {
    e.preventDefault();
    const doctorId = doctorSelection.value;
    console.log(doctorId);

    // Fetch available dates for the selected doctor
    const dateData = await axios.get(`/api/v1/doctorSchedule/availableDates/${doctorId}`);
    console.log(dateData);
    const availableDates = dateData.data.availableDates;
    console.log(availableDates);
    dateSelection.innerHTML = '<option selected>Open this select menu</option>';
    availableDates.forEach(date => {
      const opt = document.createElement('option');
      opt.value = date;
      opt.innerHTML = date;
      dateSelection.appendChild(opt);
    });
  });
}

if (dateSelection) {
  dateSelection.addEventListener('change', async e => {
    e.preventDefault();
    const doctorId = doctorSelection.value;
    const selectedDate = dateSelection.value;
    console.log(selectedDate, doctorId);
    // Fetch available time slots for the selected doctor on the selected date
    const timeData = await axios.get(`/api/v1/booking/getAvailableSlots/${doctorId}/${selectedDate}`);
    const availableTimes = timeData.data.availableSlots;

    timeSelection.innerHTML = '<option selected>Open this select menu</option>';
    availableTimes.forEach(time => {
      const opt = document.createElement('option');
      opt.value = time;
      opt.innerHTML = time;
      timeSelection.appendChild(opt);
    });
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async e => {
    try {
      e.preventDefault();
      const doctorId = doctorSelection.value;
      const selectedDate = dateSelection.value;
      const selectedTime = timeSelection.value;

      console.log(doctorId, selectedDate, selectedTime);

      const data = await axios.post('/api/v1/booking/book-patient', {
        doctorId,
        selectedDate,
        selectedTime,
      });

      if (data.data.status === 'success') {
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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... ',
        text: error.response.data.message,
      });
    }
  });
}
