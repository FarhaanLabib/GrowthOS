const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// GET all deals, optionally filtered by rep / source / tag / date range
router.get('/', async (req, res) => {
  try {
    const { rep, source, tag, from, to } = req.query;
    const filter = {};
    if (rep) filter.assignedRep = rep;
    if (source) filter.source = source;
    if (tag) filter.tags = tag;
    if (from || to) filter.createdAt = {
      ...(from && { $gte: new Date(from) }),
      ...(to && { $lte: new Date(to) })
    };

    const deals = await Deal.find(filter).populate('contactId assignedRep');
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH move a deal to a new stage (drag-and-drop)
router.patch('/:id/stage', async (req, res) => {
  try {
    const { stage, lostReason } = req.body;
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    deal.stage = stage;
    if (stage === 'Lost' && lostReason) deal.lostReason = lostReason;
    deal.activityLog.push({ type: 'stage-change', text: `Moved to ${stage}` });

    await deal.save();
    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add an activity log entry (call, message, note)
router.post('/:id/activity', async (req, res) => {
  try {
    const { type, text } = req.body;
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $push: { activityLog: { type, text } } },
      { new: true }
    );
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH bulk move multiple deals at once
router.patch('/bulk/stage', async (req, res) => {
  try {
    const { dealIds, stage } = req.body;
    await Deal.updateMany(
      { _id: { $in: dealIds } },
      { $set: { stage }, $push: { activityLog: { type: 'stage-change', text: `Bulk moved to ${stage}` } } }
    );
    res.json({ updated: dealIds.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;