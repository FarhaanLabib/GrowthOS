const express = require('express');
const router = express.Router();
const pixelTrackingController = require('../controllers/pixelTrackingController');

router.post('/', pixelTrackingController.createEvent);
router.get('/', pixelTrackingController.listEvents);
router.get('/health/:eventName', pixelTrackingController.checkHealth);

module.exports = router;