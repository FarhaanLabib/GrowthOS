const connectDB = require('../config/db');

async function insertReport(report) {
  const db = await connectDB();
  return db.collection('clientReports').insertOne(report);
}

async function getLatestReport(clientId) {
  const db = await connectDB();
  const result = await db.collection('clientReports')
    .find({ clientId })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
  return result[0] || null;
}

module.exports = { insertReport, getLatestReport };