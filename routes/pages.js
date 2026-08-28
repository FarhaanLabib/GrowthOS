const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// GET /api/pages — list all pages (for the builder dashboard)
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const pages = await db.collection('pages').find().toArray();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pages — create a new blank page
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { title, slug } = req.body;

    const newPage = {
      title,
      slug,
      sections: [],
      visits: 0,
      submissions: 0,
      createdAt: new Date()
    };

    const result = await db.collection('pages').insertOne(newPage);
    res.json({ ...newPage, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/pages/:id — save/update a page's sections
router.put('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const { sections } = req.body;

    await db.collection('pages').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { sections } }
    );

    res.json({ message: 'Page updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pages/public/:slug — fetch a page by its public URL slug (also counts a visit)
router.get('/public/:slug', async (req, res) => {
  try {
    const db = await connectDB();
    const page = await db.collection('pages').findOne({ slug: req.params.slug });

    if (!page) return res.status(404).json({ error: 'Page not found' });

    // Count this as a visit
    await db.collection('pages').updateOne(
      { _id: page._id },
      { $inc: { visits: 1 } }
    );

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pages/public/:slug/submit — handle a visitor submitting the form on this page
router.post('/public/:slug/submit', async (req, res) => {
  try {
    const db = await connectDB();
    const page = await db.collection('pages').findOne({ slug: req.params.slug });

    if (!page) return res.status(404).json({ error: 'Page not found' });

    // Create a CRM contact record from the submitted form data
    const contact = {
      ...req.body,
      source: `Landing Page: ${page.title}`,
      createdAt: new Date()
    };
    await db.collection('contacts').insertOne(contact);

    // Count this as a submission (for conversion rate tracking)
    await db.collection('pages').updateOne(
      { _id: page._id },
      { $inc: { submissions: 1 } }
    );

    res.json({ message: 'Submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;