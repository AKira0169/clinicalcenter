const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chatController = require('./Middleware/chatController'); // Import the socket controller

dotenv.config({ path: './config/config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const port = process.env.PORT || 8000;

mongoose.connect(DB).then(() => {
  console.log('DB Connection successfully');

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  // Initialize Socket.IO and store the instance internally
  require('./config/socket').init(server);
  console.log('Socket.io successfully initialized');

  chatController(); // Call the controller without passing `io`
});
