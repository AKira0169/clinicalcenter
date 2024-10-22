const mongoose = require('mongoose');

const inventoryLogsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The record must belong to a user'],
    },
    action: {
      type: String,
      enum: ['added', 'removed', 'created', 'priceChanged', 'name changed', 'description changed', 'deleted'],
      required: [true, 'The record must have an action'],
    },
    quantity: {
      type: Number,
      required: [true, 'The record must have a quantity'],
    },
    // Save item attributes instead of a reference
    itemName: {
      type: String,
      required: true,
    },
    itemDescription: String,
    itemPrice: Number,
    itemQuantity: Number,
    reason: {
      type: String,
      required: [true, 'The record must have a reason'],
    },
  },
  {
    timestamps: true,
  },
);

const InventoryLogs = mongoose.model('InventoryLogs', inventoryLogsSchema);

module.exports = InventoryLogs;
