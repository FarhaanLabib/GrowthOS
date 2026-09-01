const express = require('express');
const router = express.Router();
const clientReportController = require('../controllers/clientReportController');

router.post('/', clientReportController.createReport);
router.get('/:clientId', clientReportController.getReport);

module.exports = router;