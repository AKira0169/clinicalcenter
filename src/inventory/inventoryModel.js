const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    quantity: Number,
    price: Number,
    photo: {
      type: String,
      default: 'default.jpg',
    },
    category: String,
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
