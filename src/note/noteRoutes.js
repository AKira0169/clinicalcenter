const express = require('express');
const multer = require('multer');
const noteController = require('./noteController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

router.use(authenticationController.protect);
const upload = multer();

router.post('/', upload.none(), noteController.createNote);
router.get('/:id', noteController.getNotesByPatient);
router.patch('/:id', upload.none(), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
