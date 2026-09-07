const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const invoices = await db.collection('invoices').find().toArray();
  res.json(invoices);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('invoices').insertOne(req.body);
  res.json(result);
});

module.exports = router;