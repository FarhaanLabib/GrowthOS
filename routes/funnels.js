const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// GET all funnels
router.get('/', async (req, res) => {
  const db = await connectDB();
  const funnels = await db.collection('funnels').find().toArray();
  res.json(funnels);
});

// POST create a new funnel: { name, steps: [{ name, visitors: 0, progressed: 0 }] }
router.post('/', async (req, res) => {
  const db = await connectDB();
  const funnel = {
    name: req.body.name,
    steps: req.body.steps || [],
    createdAt: new Date()
  };
  const result = await db.collection('funnels').insertOne(funnel);
  res.json(result);
});

// POST record a visit hitting a specific step (increments visitor count)
router.post('/:funnelId/steps/:stepIndex/visit', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const db = await connectDB();
  const field = `steps.${req.params.stepIndex}.visitors`;
  const result = await db.collection('funnels').updateOne(
    { _id: new ObjectId(req.params.funnelId) },
    { $inc: { [field]: 1 } }
  );
  res.json(result);
});

// POST record a progression to the next step (increments progressed count)
router.post('/:funnelId/steps/:stepIndex/progress', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const db = await connectDB();
  const field = `steps.${req.params.stepIndex}.progressed`;
  const result = await db.collection('funnels').updateOne(
    { _id: new ObjectId(req.params.funnelId) },
    { $inc: { [field]: 1 } }
  );
  res.json(result);
});

module.exports = router;