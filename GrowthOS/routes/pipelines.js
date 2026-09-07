const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

router.get('/', async (req, res) => {
  const db = await connectDB();
  const pipelines = await db.collection('pipelines').find().toArray();
  res.json(pipelines);
});

router.post('/', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('pipelines').insertOne(req.body);
  res.json(result);
});

module.exports = router;