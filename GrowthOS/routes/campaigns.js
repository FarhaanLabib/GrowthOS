const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const campaigns = await db.collection('campaigns').find().toArray();
  res.json(campaigns);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('campaigns').insertOne(req.body);
  res.json(result);
});

module.exports = router;