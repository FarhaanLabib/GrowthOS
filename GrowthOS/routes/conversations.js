const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// GET all conversations or filter by channel
router.get('/', async (req, res) => {
  try {
    const filter = req.query.channel ? { channel: req.query.channel } : {};
    const conversations = await Conversation.find(filter).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new message or internal note to a thread
router.post('/:id/messages', async (req, res) => {
  try {
    const { body, isInternalNote, senderType } = req.body;
    const conversation = await Conversation.findById(req.id);
    
    conversation.messages.push({
      body,
      isInternalNote: isInternalNote || false,
      senderType: senderType || 'user',
      createdAt: new Date()
    });
    
    await conversation.save();
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH assign conversation to team member
router.patch('/:id', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    );
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;