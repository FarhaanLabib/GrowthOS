const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

// GET /api/sequences — Fetch all sequence templates
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const sequences = await db.collection('sequences').find({}).toArray();
    res.json(sequences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sequences — Create a new sequence template
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { id, name, steps } = req.body;

    const newSeq = {
      id: id || `seq-${Date.now()}`,
      name: name || 'New Sequence Template',
      steps: steps || [
        { delayDays: 0, channel: 'Email', message: 'Welcome email' }
      ],
      createdAt: new Date()
    };

    const result = await db.collection('sequences').insertOne(newSeq);
    res.json({ success: true, sequence: { _id: result.insertedId, ...newSeq } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sequences/executions — Fetch live executions
router.get('/executions', async (req, res) => {
  try {
    const db = await connectDB();
    const executions = await db.collection('sequence_executions').find({}).toArray();
    res.json(executions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sequences/trigger — Trigger a sequence execution
router.post('/trigger', async (req, res) => {
  try {
    const db = await connectDB();
    const { sequenceId, leadId } = req.body;

    if (!sequenceId) {
      return res.status(400).json({ error: 'Sequence selection is required.' });
    }

    // Safely query template by string 'id' or MongoDB '_id'
    let query = { id: sequenceId };
    if (ObjectId.isValid(sequenceId)) {
      query = { $or: [{ id: sequenceId }, { _id: new ObjectId(sequenceId) }] };
    }

    let sequence = await db.collection('sequences').findOne(query);

    const executionDoc = {
      sequenceId: sequenceId,
      sequenceName: sequence ? sequence.name : 'Automated Sequence',
      leadId: leadId || 'Default Lead',
      status: 'Active',
      currentStep: 1,
      totalSteps: sequence?.steps?.length || 2,
      startedAt: new Date()
    };

    const result = await db.collection('sequence_executions').insertOne(executionDoc);
    res.json({ success: true, executionId: result.insertedId, execution: executionDoc });
  } catch (err) {
    console.error('Trigger Endpoint Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;