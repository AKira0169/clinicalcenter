const express = require('express');
const invoiceController = require('./invoiceController');
const authenticationController = require('../../Middleware/authenticationController');

const router = express.Router();

router.use(authenticationController.protect);
router.get('/getInvoiceByDate', invoiceController.getInvoiceByDate);

router.post('/', invoiceController.createInvoice);
router.post('/printInvoices', invoiceController.printInvoices);

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoice);
router.get('/getInvoiceByPatient/:id', invoiceController.getInvoiceByPatient);
router.get('/getInvoiceByService/:id', invoiceController.getInvoiceByService);

router.patch('/updateInvoice/:id', invoiceController.updateInvoice);
router.patch('/discount/:id', invoiceController.discount);

router.delete('/deleteInvoice/:id', invoiceController.deleteInvoice);

module.exports = router;
