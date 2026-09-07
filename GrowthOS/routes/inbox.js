const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// GET /api/inbox — list all conversations, optional channel filter
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { channel } = req.query; // reads ?channel=facebook from the URL, if present

    const filter = channel && channel !== 'all' ? { channel } : {};
    const conversations = await db.collection('conversations').find(filter).toArray();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inbox — simulate a new incoming conversation
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactName, channel, firstMessage } = req.body;

    const newConversation = {
      contactName,
      channel,
      messages: [{ sender: 'customer', text: firstMessage, timestamp: new Date() }],
      assignedTo: '',
      notes: [],
      status: 'unread',
      createdAt: new Date()
    };

    const result = await db.collection('conversations').insertOne(newConversation);
    res.json({ ...newConversation, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inbox/:id/reply — team sends a reply in a conversation
router.post('/:id/reply', async (req, res) => {
  try {
    const db = await connectDB();
    const { text } = req.body;

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: { messages: { sender: 'team', text, timestamp: new Date() } },
        $set: { status: 'read' }
      }
    );

    res.json({ message: 'Reply sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inbox/:id/note — add an internal note (not visible to customer)
router.post('/:id/note', async (req, res) => {
  try {
    const db = await connectDB();
    const { text } = req.body;

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { notes: { text, timestamp: new Date() } } }
    );

    res.json({ message: 'Note added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inbox/:id/assign — assign conversation to a team member
router.put('/:id/assign', async (req, res) => {
  try {
    const db = await connectDB();
    const { assignedTo } = req.body;

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { assignedTo } }
    );

    res.json({ message: 'Assigned' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;