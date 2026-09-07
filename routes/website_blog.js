const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

const slugify = (str = '') =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blog - all posts (admin view), newest first
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const posts = await db.collection('blogPosts').find().sort({ createdAt: -1 }).toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blog/published - only published posts, for the public site
router.get('/published', async (req, res) => {
  try {
    const db = await connectDB();
    const posts = await db.collection('blogPosts')
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blog/slug/:slug - single published post by slug (for the public page renderer)
router.get('/slug/:slug', async (req, res) => {
  try {
    const db = await connectDB();
    const post = await db.collection('blogPosts').findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blog - create a post: { title, content }
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { title, content } = req.body;

    const post = {
      title,
      slug: slugify(title),
      content,
      published: false,
      publishedAt: null,
      createdAt: new Date()
    };

    const result = await db.collection('blogPosts').insertOne(post);
    res.json({ success: true, postId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/blog/:id/publish - toggle a post live on the public site
router.put('/:id/publish', async (req, res) => {
  try {
    const db = await connectDB();
    const post = await db.collection('blogPosts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const nowPublished = !post.published;
    const result = await db.collection('blogPosts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { published: nowPublished, publishedAt: nowPublished ? new Date() : post.publishedAt } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/blog/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('blogPosts').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;