const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

const toneWords = {
  Professional: ['Discover', 'Introducing', 'Experience'],
  Casual: ['Check out', 'Hey, look at', "Here's"],
  Urgent: ['Don\'t miss', 'Act now:', 'Last chance —'],
  Friendly: ['We think you\'ll love', 'Come see', 'Say hello to'],
  Bold: ['Unleash', 'Dominate with', 'Transform with']
};

function generateCopy({ businessType, offer, audience, tone }) {
  const openers = toneWords[tone] || toneWords.Professional;
  return openers.map(opener =>
    `${opener} ${offer} — built for ${audience} in ${businessType}. Get started today.`
  );
}

// POST generate 3 copy variations
router.post('/generate', (req, res) => {
  const variations = generateCopy(req.body);
  res.json({ variations });
});

// POST save a chosen variation to the library
router.post('/save', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('copyLibrary').insertOne({
    text: req.body.text,
    tone: req.body.tone,
    createdAt: new Date()
  });
  res.json(result);
});

// GET the saved library
router.get('/library', async (req, res) => {
  const db = await connectDB();
  const items = await db.collection('copyLibrary').find().sort({ createdAt: -1 }).toArray();
  res.json(items);
});

module.exports = router;