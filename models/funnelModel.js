const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

async function getAllFunnels() {
  const db = await connectDB();
  return db.collection('funnels').find().toArray();
}

async function createFunnel(funnel) {
  const db = await connectDB();
  return db.collection('funnels').insertOne(funnel);
}

async function incrementStepField(funnelId, field) {
  const db = await connectDB();
  return db.collection('funnels').updateOne(
    { _id: new ObjectId(funnelId) },
    { $inc: { [field]: 1 } }
  );
}

module.exports = { getAllFunnels, createFunnel, incrementStepField };