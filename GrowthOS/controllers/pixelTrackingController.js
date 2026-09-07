const pixelEventModel = require('../models/pixelEventModel');

async function createEvent(req, res) {
  const event = {
    eventName: req.body.eventName,
    source: req.body.source,
    contactId: req.body.contactId || null,
    receivedAt: new Date()
  };
  const result = await pixelEventModel.insertEvent(event);
  res.json(result);
}

async function listEvents(req, res) {
  const events = await pixelEventModel.getAllEvents();

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
}

async function checkHealth(req, res) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await pixelEventModel.findRecentEvent(req.params.eventName, since);
  res.json({ eventName: req.params.eventName, firedInLast24h: !!recent });
}

module.exports = { createEvent, listEvents, checkHealth };