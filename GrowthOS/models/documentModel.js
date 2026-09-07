const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

async function insertDocument(doc) {
  const db = await connectDB();
  return db.collection('documents').insertOne(doc);
}

async function markViewedIfSent(id) {
  const db = await connectDB();
  return db.collection('documents').updateOne(
    { _id: id, status: 'Sent' },
    { $set: { status: 'Viewed', viewedAt: new Date() } }
  );
}

async function getById(id) {
  const db = await connectDB();
  return db.collection('documents').findOne({ _id: id });
}

async function signDocument(id, signedBy) {
  const db = await connectDB();
  return db.collection('documents').updateOne(
    { _id: id },
    { $set: { status: 'Signed', signedAt: new Date(), signedBy } }
  );
}

async function declineDocument(id) {
  const db = await connectDB();
  return db.collection('documents').updateOne(
    { _id: id },
    { $set: { status: 'Declined' } }
  );
}

module.exports = { insertDocument, markViewedIfSent, getById, signDocument, declineDocument, ObjectId };