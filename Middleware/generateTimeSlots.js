function generateTimeSlots(startTime, endTime, bookedSlots) {
  const availableSlots = [];

  // Create Date objects for start and end times
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endTimeObj = new Date(`1970-01-01T${endTime}:00`);

  // Increment time by 10-minute intervals
  while (currentTime < endTimeObj) {
    const timeString = currentTime.toTimeString().substring(0, 5); // Format as "HH:MM"

    // Check if the slot is already booked
    const isBooked = bookedSlots.some(
      slot => timeString >= slot.appointmentStartTime && timeString < slot.appointmentEndTime,
    );

    if (!isBooked) {
      availableSlots.push(timeString); // Add slot to available list if not booked
    }

    // Move to next 10-minute slot
    currentTime.setMinutes(currentTime.getMinutes() + 10);
  }

  return availableSlots;
}

module.exports = generateTimeSlots;
