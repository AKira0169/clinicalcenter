const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Inventory = require('./inventoryModel');
const InventoryLogs = require('../inventoryLogs/inventoryLogsModel');
const { getIo } = require('../../config/socket');

// Create Inventory Item
exports.createItem = catchAsync(async (req, res, next) => {
  if (!req.body.price || !req.body.quantity || !req.body.name || !req.body.description || !req.body.category) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const item = await Inventory.create(req.body);
  if (!item) {
    return next(new AppError('Failed to create inventory item', 500));
  }

  // Log creation
  await InventoryLogs.create({
    itemName: item.name, // Save the name of the item
    itemDescription: item.description, // Save the description of the item
    itemPrice: item.price, // Save the price of the item
    itemQuantity: item.quantity, // Save the updated quantity of the item
    action: 'created',
    user: req.user._id,
    quantity: item.quantity,
    reason: 'Item created', // Save the reason
  });

  const logs = await InventoryLogs.find(); // Fetch last 10 logs for this item
  getIo().emit('logs', { logs });

  res.status(200).json({
    status: 'success',
    data: item,
    logs,
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const { quantity: newQuantity, reason, price, name, description } = req.body; // New values from the request
  const item = await Inventory.findById(req.params.id); // Fetch the item by ID

  if (!item) {
    return next(new AppError('Item not found', 404)); // Item not found error
  }

  let action; // Action to be logged

  // Check if newQuantity is provided to handle quantity updates
  if (newQuantity !== undefined) {
    const currentQuantity = item.quantity; // Get the current quantity

    if (newQuantity < currentQuantity) {
      // If trying to remove items
      if (currentQuantity - newQuantity < 0) {
        return next(new AppError('Not enough items in stock to remove', 400)); // Prevent removal if not enough stock
      }
      action = 'removed'; // Set action to 'removed'
      item.quantity -= currentQuantity - newQuantity; // Reduce the quantity
    } else if (newQuantity > currentQuantity) {
      action = 'added'; // Set action to 'added'
      item.quantity += newQuantity - currentQuantity; // Increase the quantity
    }
  }

  // Handle name update
  if (name && name !== item.name) {
    action = 'name changed'; // Set action to 'name changed'
    item.name = name; // Update name
  }

  // Handle description update
  if (description && description !== item.description) {
    action = 'description changed'; // Set action to 'description changed'
    item.description = description; // Update description
  }

  // Handle price update
  if (price && price !== item.price) {
    action = 'priceChanged'; // Set action to 'price changed'
    item.price = price; // Update price
  }

  // If no updates were made, return an error
  if (!action) {
    return next(new AppError('No changes were made to the item', 400)); // No changes error
  }

  // Update inStock status
  item.inStock = item.quantity > 0;
  await item.save(); // Save the updated item

  // Log the action with full item details
  await InventoryLogs.create({
    itemName: item.name, // Save the name of the item
    itemDescription: item.description, // Save the description of the item
    itemPrice: item.price, // Save the price of the item
    itemQuantity: item.quantity, // Save the updated quantity of the item
    action,
    user: req.user._id,
    quantity: newQuantity !== undefined ? newQuantity - item.quantity : 0, // Log the difference if quantity was updated
    reason: reason || 'Item updated', // Save the reason
  });

  // Emit logs to the socket
  const logs = await InventoryLogs.find().sort({ createdAt: -1 }).limit(10); // Fetch last 10 logs for this item
  getIo().emit('logs', { logs });

  res.status(200).json({
    status: 'success',
    data: item,
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: item,
  });
});

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await Inventory.find();
  res.status(200).json({
    status: 'success',
    data: items,
  });
});
