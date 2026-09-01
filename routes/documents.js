const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// POST create a document to send for signature
router.post('/', async (req, res) => {
  const db = await connectDB();
  const doc = {
    title: req.body.title,
    clientName: req.body.clientName,
    content: req.body.content,
    status: 'Sent',
    createdAt: new Date(),
    viewedAt: null,
    signedAt: null,
    signedBy: null
  };
  const result = await db.collection('documents').insertOne(doc);
  res.json(result);
});

// GET a document by ID (marks it Viewed)
router.get('/:id', async (req, res) => {
  const db = await connectDB();
  const id = new ObjectId(req.params.id);
  await db.collection('documents').updateOne(
    { _id: id, status: 'Sent' },
    { $set: { status: 'Viewed', viewedAt: new Date() } }
  );
  const doc = await db.collection('documents').findOne({ _id: id });
  res.json(doc);
});

// POST sign a document
router.post('/:id/sign', async (req, res) => {
  const db = await connectDB();
  const id = new ObjectId(req.params.id);
  const result = await db.collection('documents').updateOne(
    { _id: id },
    { $set: { status: 'Signed', signedAt: new Date(), signedBy: req.body.signedBy } }
  );
  res.json(result);
});

// POST decline a document
router.post('/:id/decline', async (req, res) => {
  const db = await connectDB();
  const id = new ObjectId(req.params.id);
  const result = await db.collection('documents').updateOne(
    { _id: id },
    { $set: { status: 'Declined' } }
  );
  res.json(result);
});

module.exports = router;