const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// GET /api/contacts - Retrieve contacts filtered by pipeline stage
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { stage } = req.query;
    const query = stage ? { pipelineStage: stage } : {};

    const contacts = await db.collection('contacts').find(query).toArray();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/contacts/stage - Move contact to a new pipeline stage
router.put('/stage', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactId, newStage } = req.body;

    const result = await db.collection('contacts').updateOne(
      { _id: contactId },
      { $set: { pipelineStage: newStage, updatedAt: new Date() } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
