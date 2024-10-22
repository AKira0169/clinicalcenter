const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
});
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
