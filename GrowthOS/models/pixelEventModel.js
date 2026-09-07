const connectDB = require('../config/db');

async function insertEvent(event) {
  const db = await connectDB();
  return db.collection('pixelEvents').insertOne(event);
}

async function getAllEvents() {
  const db = await connectDB();
  return db.collection('pixelEvents').find().sort({ receivedAt: -1 }).toArray();
}

async function findRecentEvent(eventName, since) {
  const db = await connectDB();
  return db.collection('pixelEvents').findOne({
    eventName,
    receivedAt: { $gte: since }
  });
}

module.exports = { insertEvent, getAllEvents, findRecentEvent };