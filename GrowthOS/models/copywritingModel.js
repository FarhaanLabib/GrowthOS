const connectDB = require('../config/db');

async function insertCopy(item) {
  const db = await connectDB();
  return db.collection('copyLibrary').insertOne(item);
}

async function getLibrary() {
  const db = await connectDB();
  return db.collection('copyLibrary').find().sort({ createdAt: -1 }).toArray();
}

module.exports = { insertCopy, getLibrary };