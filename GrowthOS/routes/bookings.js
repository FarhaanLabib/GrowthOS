const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const bookings = await db.collection('bookings').find().toArray();
  res.json(bookings);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('bookings').insertOne(req.body);
  res.json(result);
});

module.exports = router;