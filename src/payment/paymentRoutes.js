const router = require('express').Router();
const PaymentController = require('./paymentController');

router.post('/', PaymentController.createPayment);
router.get('/', PaymentController.getAllPayments);
router.get('/:id', PaymentController.getPayment);
router.patch('/:id', PaymentController.updatePayment);
router.delete('/:id', PaymentController.deletePayment);

module.exports = router;
