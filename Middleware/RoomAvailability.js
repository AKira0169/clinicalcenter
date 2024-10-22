const isRoomAvailable = async (room, date, startTime, endTime) => {
  if (!room) {
    throw new Error('Room not found');
  }
  if (room.bookings.length === 0) {
    return true;
  }

  // Check for overlapping bookings
  const isAvailable = room.bookings.every(
    booking =>
      date.toDateString() !== booking.date.toDateString() ||
      endTime <= booking.startTime ||
      startTime >= booking.endTime,
  );

  return isAvailable;
};

module.exports = { isRoomAvailable };
