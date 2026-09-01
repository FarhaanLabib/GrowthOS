const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// POST a simulated pixel/CAPI event
router.post('/', async (req, res) => {
  const db = await connectDB();
  const event = {
    eventName: req.body.eventName,       // e.g. "Purchase", "Lead"
    source: req.body.source,             // "browser" or "capi"
    contactId: req.body.contactId || null,
    receivedAt: new Date()
  };
  const result = await db.collection('pixelEvents').insertOne(event);
  res.json(result);
});

// GET the event log, with basic dedup + match quality
router.get('/', async (req, res) => {
  const db = await connectDB();
  const events = await db.collection('pixelEvents').find().sort({ receivedAt: -1 }).toArray();

  // Flag duplicates: same eventName + contactId within 60 seconds, from different sources
  const withQuality = events.map((e, i) => {
    const duplicate = events.some((other, j) =>
      i !== j &&
      other.eventName === e.eventName &&
      other.contactId === e.contactId &&
      other.source !== e.source &&
      Math.abs(new Date(other.receivedAt) - new Date(e.receivedAt)) < 60000
    );
    const matchQuality = e.contactId ? (duplicate ? 'Good' : 'Excellent') : 'Poor';
    return { ...e, duplicate, matchQuality };
  });

  res.json(withQuality);
});

// GET missing-event alert: has a given event fired in the last 24h?
router.get('/health/:eventName', async (req, res) => {
  const db = await connectDB();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await db.collection('pixelEvents').findOne({
    eventName: req.params.eventName,
    receivedAt: { $gte: since }
  });
  res.json({ eventName: req.params.eventName, firedInLast24h: !!recent });
});

module.exports = router;