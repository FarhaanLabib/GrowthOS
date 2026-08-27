
const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const messages = await db.collection('messages').find().toArray();
  res.json(messages);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('messages').insertOne(req.body);
  res.json(result);
});

module.exports = router;