const express = require('express');
const router = express.Router();
const SmsCampaign = require('../models/SmsCampaign');

// POST create/schedule an SMS campaign
router.post('/', async (req, res) => {
  try {
    if (req.body.message && req.body.message.length > 160) {
      return res.status(400).json({ error: 'Message exceeds 160 character limit' });
    }
    const campaign = await SmsCampaign.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET list all SMS campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await SmsCampaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update delivery stats (call from your SMS provider's webhook)
router.patch('/:id/stats', async (req, res) => {
  try {
    const { field, incrementBy = 1 } = req.body; // field: 'delivered' | 'failed' | 'optOuts'
    const campaign = await SmsCampaign.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`stats.${field}`]: incrementBy } },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST handle an inbound reply — checks for STOP keyword, otherwise routes to the omnichannel inbox
router.post('/inbound', async (req, res) => {
  try {
    const { from, body } = req.body;

    if (body.trim().toUpperCase() === 'STOP') {
      // TODO: mark this contact as unsubscribed in your Contact model
      return res.json({ handled: 'opt-out', from });
    }

    // TODO: forward this reply into your existing messages.js / inbox conversation logic
    res.json({ handled: 'reply-forwarded', from, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;