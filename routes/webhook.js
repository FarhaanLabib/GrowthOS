const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

// GET /api/webhooks - list all registered outbound/inbound webhook endpoints
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const webhooks = await db.collection('webhooks').find().sort({ createdAt: -1 }).toArray();
    res.json(webhooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhooks - register a new endpoint: { name, event, targetUrl }
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { name, event, targetUrl } = req.body;

    const webhook = {
      name,
      event,                                   // e.g. "contact.created", "invoice.paid"
      targetUrl: targetUrl || null,             // where GrowthOS sends this event, if outbound
      secret: crypto.randomBytes(16).toString('hex'),
      active: true,
      createdAt: new Date()
    };

    const result = await db.collection('webhooks').insertOne(webhook);
    res.json({ success: true, webhookId: result.insertedId, secret: webhook.secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/webhooks/:id/toggle - enable or disable a webhook
router.put('/:id/toggle', async (req, res) => {
  try {
    const db = await connectDB();
    const webhook = await db.collection('webhooks').findOne({ _id: new ObjectId(req.params.id) });
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' });

    const result = await db.collection('webhooks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { active: !webhook.active } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhooks/incoming/:id - external services POST here; GrowthOS logs the payload
router.post('/incoming/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const webhook = await db.collection('webhooks').findOne({ _id: new ObjectId(req.params.id) });
    if (!webhook || !webhook.active) return res.status(404).json({ error: 'Webhook not found or inactive' });

    const log = {
      webhookId: webhook._id,
      payload: req.body,
      receivedAt: new Date()
    };
    await db.collection('webhookLogs').insertOne(log);

    res.json({ success: true, received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/webhooks/:id/logs - recent deliveries for one webhook
router.get('/:id/logs', async (req, res) => {
  try {
    const db = await connectDB();
    const logs = await db.collection('webhookLogs')
      .find({ webhookId: new ObjectId(req.params.id) })
      .sort({ receivedAt: -1 })
      .limit(50)
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/webhooks/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('webhooks').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;