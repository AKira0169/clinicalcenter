const jwt = require('jsonwebtoken');
const User = require('../src/user/userModel');
const { getIo } = require('../config/socket'); // Import the getIo function

const socketController = () => {
  const io = getIo(); // Retrieve the initialized io instance

  io.on('connection', async connectedSocket => {
    let user = null;
    const authorizationHeader = connectedSocket.handshake.headers.authorization;

    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        console.error('Socket authentication error:', err.message);
      }
    }

    if (user) {
      console.log(`User ${user.name} connected`);
      connectedSocket.user = user;
      connectedSocket.join(user.clinicID.toString());
      connectedSocket.on('chat message', msg => {
        io.to(user.clinicID.toString()).emit('chat message', { user: user.name, message: msg });
      });
    } else {
      console.log('Unauthenticated user connected');
    }
  });
};

module.exports = socketController;
