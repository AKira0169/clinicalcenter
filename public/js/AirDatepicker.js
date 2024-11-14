import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

// Reference to the age and birth date input fields
const ageInput = document.getElementById('age');
const birthDateInput = document.getElementById('birthDate');

// Function to calculate and set age based on DOB
function updateAgeFromDOB(birthDate) {
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  ageInput.value = age >= 0 ? age : ''; // Only set if the age is valid
}

// AirDatepicker options with onSelect callback
const options = {
  dateFormat: 'yyyy-MM-dd',
  minDate: new Date(1900, 0, 1),
  maxDate: new Date(),
  view: 'years',
  autoClose: true,
  locale: {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
  },
  onSelect({ date }) {
    updateAgeFromDOB(date); // Update age input when a date is selected
  },
};

// Initialize AirDatepicker if birthDateInput exists
if (birthDateInput) {
  new AirDatepicker('#birthDate', options);
}

// Event listener to update DOB based on age input
if (ageInput) {
  ageInput.addEventListener('input', function () {
    const age = parseInt(ageInput.value);
    if (!isNaN(age) && age >= 0) {
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - age;
      const birthDate = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
      birthDateInput.value = birthDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else {
      birthDateInput.value = '';
    }
  });
}
