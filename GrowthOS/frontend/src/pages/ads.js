const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// Sample mock ad campaign data across platforms
const mockCampaigns = [
  { id: 'c1', platform: 'Meta', name: 'FB - Lead Gen - Summer Sale', spend: 1200, impressions: 45000, clicks: 1800, leads: 60, pipelineValue: 12000 },
  { id: 'c2', platform: 'Meta', name: 'IG - Retargeting - Service Offer', spend: 800, impressions: 22000, clicks: 950, leads: 32, pipelineValue: 7500 },
  { id: 'c3', platform: 'Google', name: 'Search - High Intent Keywords', spend: 2100, impressions: 18000, clicks: 2100, leads: 105, pipelineValue: 28000 },
  { id: 'c4', platform: 'Google', name: 'Performance Max - Local', spend: 950, impressions: 31000, clicks: 1200, leads: 40, pipelineValue: 9000 },
  { id: 'c5', platform: 'TikTok', name: 'TT - Short Video Promo', spend: 650, impressions: 85000, clicks: 3400, leads: 25, pipelineValue: 4000 }
];

// GET /api/ads/performance — Retrieve aggregated and platform metrics
router.get('/performance', async (req, res) => {
  try {
    const db = await connectDB();
    
    // Check connected accounts status in database (default to connected if not set)
    let connections = await db.collection('ad_connections').findOne({ userId: 'default' });
    if (!connections) {
      connections = { userId: 'default', Meta: true, Google: true, TikTok: true };
    }

    // Filter campaigns based on active platform connections
    const activeCampaigns = mockCampaigns.filter(c => connections[c.platform]);

    // Calculate aggregated metrics
    const totalSpend = activeCampaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalImpressions = activeCampaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = activeCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalLeads = activeCampaigns.reduce((sum, c) => sum + c.leads, 0);
    const totalPipelineValue = activeCampaigns.reduce((sum, c) => sum + c.pipelineValue, 0);

    const ctr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const cpl = totalLeads ? (totalSpend / totalLeads).toFixed(2) : 0;
    const roas = totalSpend ? (totalPipelineValue / totalSpend).toFixed(2) : 0;

    res.json({
      connections,
      summary: {
        totalSpend,
        totalImpressions,
        totalClicks,
        totalLeads,
        ctr,
        cpl,
        roas,
        totalPipelineValue
      },
      campaigns: activeCampaigns
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ads/toggle-connection — Simulate OAuth connect/disconnect
router.post('/toggle-connection', async (req, res) => {
  try {
    const db = await connectDB();
    const { platform, status } = req.body; // e.g. platform: 'Meta', status: true/false

    await db.collection('ad_connections').updateOne(
      { userId: 'default' },
      { $set: { [platform]: status } },
      { upsert: true }
    );

    res.json({ message: `${platform} connection updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;