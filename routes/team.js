const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

// Falls back to a dev secret if JWT_SECRET isn't set in .env - fine for local dev,
// but set a real JWT_SECRET before this ever touches production.
const JWT_SECRET = process.env.JWT_SECRET || 'growthos-dev-secret';

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt
});

// GET /api/team - list all team members (no password hashes)
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection('users').find().sort({ createdAt: 1 }).toArray();
    res.json(users.map(publicUser));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/team/register - create a team member: { name, email, password, role }
router.post('/register', async (req, res) => {
  try {
    const db = await connectDB();
    const { name, email, password, role } = req.body;

    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      passwordHash,
      role: role || 'member', // owner | admin | member
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    res.json({ success: true, userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/team/login - verify credentials, issue a JWT
router.post('/login', async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/team/:id/role - change a member's role: { role }
router.put('/:id/role', async (req, res) => {
  try {
    const db = await connectDB();
    const { role } = req.body;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { role } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/team/:id - remove a team member
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;