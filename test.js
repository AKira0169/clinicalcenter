import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function AppointmentForm() {
  const { register, watch, handleSubmit } = useForm();

  // Use `watch` to get the values of the fields dynamically
  const selectedSpecialization = watch('specialization');
  const selectedDoctor = watch('doctor');
  const selectedDate = watch('date');

  // Fetch Specializations
  const { data: specializations } = useQuery(['specializations'], () =>
    axios.get('/api/specializations').then(res => res.data),
  );

  // Fetch Doctors based on Specialization
  const { data: doctors } = useQuery(
    ['doctors', selectedSpecialization],
    () => axios.get(`/api/doctors?specialization=${selectedSpecialization}`).then(res => res.data),
    { enabled: !!selectedSpecialization },
  );

  // Fetch Available Dates based on Doctor
  const { data: availableDates } = useQuery(
    ['availableDates', selectedDoctor],
    () => axios.get(`/api/available-dates?doctor=${selectedDoctor}`).then(res => res.data),
    { enabled: !!selectedDoctor },
  );

  // Fetch Available Times based on Date
  const { data: availableTimes } = useQuery(
    ['availableTimes', selectedDate],
    () => axios.get(`/api/available-times?date=${selectedDate}`).then(res => res.data),
    { enabled: !!selectedDate },
  );

  const onSubmit = data => {
    console.log('Form data submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Step 1: Select Specialization */}
      <label>
        Specialization:
        <select {...register('specialization')}>
          <option value=''>Select Specialization</option>
          {specializations?.map(spec => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>
      </label>

      {/* Step 2: Select Doctor */}
      {selectedSpecialization && (
        <label>
          Doctor:
          <select {...register('doctor')}>
            <option value=''>Select Doctor</option>
            {doctors?.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Step 3: Select Date */}
      {selectedDoctor && (
        <label>
          Date:
          <select {...register('date')}>
            <option value=''>Select Date</option>
            {availableDates?.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Step 4: Select Time */}
      {selectedDate && (
        <label>
          Time:
          <select {...register('time')}>
            <option value=''>Select Time</option>
            {availableTimes?.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
      )}

      <button type='submit'>Book Appointment</button>
    </form>
  );
}

export default AppointmentForm;
