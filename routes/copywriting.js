const express = require('express');
const router = express.Router();
const copywritingController = require('../controllers/copywritingController');

router.post('/generate', copywritingController.generate);
router.post('/save', copywritingController.saveCopy);
router.get('/library', copywritingController.getLibrary);

module.exports = router;