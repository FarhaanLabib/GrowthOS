const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.post('/', documentController.createDocument);
router.get('/:id', documentController.viewDocument);
router.post('/:id/sign', documentController.signDocument);
router.post('/:id/decline', documentController.declineDocument);

module.exports = router;