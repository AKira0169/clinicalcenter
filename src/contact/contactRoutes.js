const express = require('express');

const REFDRController = require('./contactController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
router.use(protectRoutes);
router.post('/', REFDRController.getsearchedRefDr);
router.get('/test', REFDRController.ALLgetREfdr);

router.post('/createRefDr', REFDRController.createRefDr);
router.delete('/deleteRefDr/:id', REFDRController.deleteRefDr);

module.exports = router;
