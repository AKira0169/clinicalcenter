let io; // Declare a variable to hold the Socket.IO instance

module.exports = {
  init: httpServer => {
    io = require('socket.io')(httpServer); // Initialize and assign the Socket.IO instance
    return io; // Optionally return the instance if needed
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io is not initialized'); // Throw error if not initialized
    }
    return io; // Return the initialized instance
  },
};
