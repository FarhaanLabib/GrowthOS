const express = require('express');
const router = express.Router();
const ReviewRequest = require('../models/ReviewRequest');
const Contact = require('../models/Contact'); // assumes a Contact model already exists in your project

// POST trigger a review request (call this when a deal is marked Won / job Completed)
router.post('/trigger/:contactId', async (req, res) => {
  try {
    const { dealId, deliveryMethod = 'both', platform = 'google', customUrl, delayHours = 24 } = req.body;

    const contact = await Contact.findById(req.params.contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    if (contact.unsubscribed) {
      const skipped = await ReviewRequest.create({
        contactId: contact._id,
        dealId,
        deliveryMethod,
        platform,
        customUrl,
        delayHours,
        status: 'skipped-optout'
      });
      return res.status(200).json(skipped);
    }

    const reviewRequest = await ReviewRequest.create({
      contactId: contact._id,
      dealId,
      deliveryMethod,
      platform,
      customUrl,
      delayHours
    });

    res.status(201).json(reviewRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark a request as sent / opened / clicked (called by your SMS/email provider webhook, or manually for now)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // 'sent' | 'opened' | 'clicked'
    const timestampField = { sent: 'sentAt', opened: 'openedAt', clicked: 'clickedAt' }[status];

    const update = { status };
    if (timestampField) update[timestampField] = new Date();

    const reviewRequest = await ReviewRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!reviewRequest) return res.status(404).json({ error: 'Review request not found' });
    res.json(reviewRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tracking overview
router.get('/', async (req, res) => {
  try {
    const requests = await ReviewRequest.find().populate('contactId dealId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;