const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// GET all contacts
router.get('/', async (req, res) => {
  const db = await connectDB();
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

// POST a new contact
router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('contacts').insertOne(req.body);
  res.json(result);
});

module.exports = router;