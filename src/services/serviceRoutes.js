const router = require('express').Router();
const serviceController = require('./serviceController');
const authenticationController = require('../../Middleware/authenticationController');

router.use(authenticationController.protect);

router.route('/').get(serviceController.getAllServices).post(serviceController.createService);

router
  .route('/:id')
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
