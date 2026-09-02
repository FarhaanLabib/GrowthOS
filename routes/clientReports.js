const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// POST create/update a report snapshot for a client
router.post('/', async (req, res) => {
  const db = await connectDB();
  const report = {
    clientId: req.body.clientId,
    clientName: req.body.clientName,
    adSpend: req.body.adSpend || 0,
    leadsGenerated: req.body.leadsGenerated || 0,
    cpl: req.body.cpl || 0,
    appointmentsBooked: req.body.appointmentsBooked || 0,
    dealsWon: req.body.dealsWon || 0,
    updatedAt: new Date()
  };
  const result = await db.collection('clientReports').insertOne(report);
  res.json(result);
});

// GET a specific client's report (this is the "client login only sees their own data" part)
router.get('/:clientId', async (req, res) => {
  const db = await connectDB();
  const report = await db.collection('clientReports')
    .find({ clientId: req.params.clientId })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
  res.json(report[0] || { message: 'No report found for this client' });
});

module.exports = router;