const express = require('express');
const roomController = require('./roomController');

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoom);
router.patch('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
