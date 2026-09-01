const express = require('express');
const router = express.Router();
const EmailCampaign = require('../models/EmailCampaign');

// POST create/schedule a new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = await EmailCampaign.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET list all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats for one campaign
router.get('/:id/stats', async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update stats (call this from your email provider's webhook — open, click, bounce, unsubscribe events)
router.patch('/:id/stats', async (req, res) => {
  try {
    const { field, incrementBy = 1 } = req.body; // field: 'opens' | 'clicks' | 'unsubscribes' | 'bounces' | 'sent'
    const update = { $inc: { [`stats.${field}`]: incrementBy } };
    const campaign = await EmailCampaign.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH declare the A/B test winner (and auto-set for future sends)
router.patch('/:id/winner', async (req, res) => {
  try {
    const { winningSubject } = req.body;
    const campaign = await EmailCampaign.findByIdAndUpdate(
      req.params.id,
      { winningSubject, status: 'sending' },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;