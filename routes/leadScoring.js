const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// ============================================
// SCORING RULES — YOUR CHOICE, change these numbers/categories freely
// ============================================
function calculateScore(lead) {
  let score = 0;

  // Budget scoring
  if (lead.budget === 'high') score += 30;
  else if (lead.budget === 'medium') score += 15;
  else if (lead.budget === 'low') score += 5;

  // Timeline scoring
  if (lead.timeline === 'immediate') score += 30;
  else if (lead.timeline === 'this_month') score += 20;
  else if (lead.timeline === 'browsing') score += 5;

  // Behavioral: page revisits (capped at 20 points total)
  score += Math.min((lead.pageRevisits || 0) * 5, 20);

  // Behavioral: email opened
  if (lead.emailOpened) score += 10;

  // Behavioral: link clicked
  if (lead.linkClicked) score += 15;

  // Never exceed 100 — FIXED, keep this safety cap
  score = Math.min(score, 100);

  return score;
}

// TAG THRESHOLDS — YOUR CHOICE, change these cutoff numbers freely
function getTag(score) {
  if (score >= 75) return 'High Priority';
  if (score >= 50) return 'Medium Priority';
  if (score >= 25) return 'Low Priority';
  return 'Not urgent';
}

// ============================================
// ROUTES — FIXED structure, don't change the shape of these
// ============================================

// POST /api/leads — create a new lead, automatically scored
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const leadData = req.body;

    const score = calculateScore(leadData);
    const tag = getTag(score);

    const newLead = {
      ...leadData,
      score,
      tag,
      createdAt: new Date()
    };

    const result = await db.collection('contacts').insertOne(newLead);
    res.json({ ...newLead, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads — list all leads, sorted by score (highest first)
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const leads = await db.collection('contacts').find().sort({ score: -1 }).toArray();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;