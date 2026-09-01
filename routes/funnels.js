const express = require('express');
const router = express.Router();
const funnelController = require('../controllers/funnelController');

router.get('/', funnelController.listFunnels);
router.post('/', funnelController.createFunnel);
router.post('/:funnelId/steps/:stepIndex/visit', funnelController.recordVisit);
router.post('/:funnelId/steps/:stepIndex/progress', funnelController.recordProgress);

module.exports = router;
