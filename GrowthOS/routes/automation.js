const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

// GET /api/automations - list all workflows
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const automations = await db.collection('automations').find().sort({ createdAt: -1 }).toArray();
    res.json(automations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/automations - create a workflow: { name, trigger, actions: [{ type, config }] }
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { name, trigger, actions = [] } = req.body;

    const automation = {
      name,
      trigger,          // e.g. "contact.created", "invoice.paid", "form.submitted"
      actions,          // e.g. [{ type: "send_email", config: {...} }, { type: "add_tag", config: {...} }]
      enabled: true,
      runCount: 0,
      lastRunAt: null,
      createdAt: new Date()
    };

    const result = await db.collection('automations').insertOne(automation);
    res.json({ success: true, automationId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/automations/:id/toggle - enable or disable a workflow
router.put('/:id/toggle', async (req, res) => {
  try {
    const db = await connectDB();
    const automation = await db.collection('automations').findOne({ _id: new ObjectId(req.params.id) });
    if (!automation) return res.status(404).json({ error: 'Automation not found' });

    const result = await db.collection('automations').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { enabled: !automation.enabled } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/automations/:id/run - simulate a trigger firing and the actions executing
router.post('/:id/run', async (req, res) => {
  try {
    const db = await connectDB();
    const automation = await db.collection('automations').findOne({ _id: new ObjectId(req.params.id) });
    if (!automation) return res.status(404).json({ error: 'Automation not found' });
    if (!automation.enabled) return res.status(400).json({ error: 'Automation is disabled' });

    await db.collection('automations').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { runCount: 1 }, $set: { lastRunAt: new Date() } }
    );

    res.json({
      success: true,
      ran: automation.actions.map(a => ({ type: a.type, status: 'executed' }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/automations/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('automations').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;