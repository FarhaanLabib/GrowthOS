const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDB = require('../config/db');

// GET /api/invoices - all invoices, newest first
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const invoices = await db.collection('invoices').find().sort({ createdAt: -1 }).toArray();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/invoices/:id - single invoice
router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const invoice = await db.collection('invoices').findOne({ _id: new ObjectId(req.params.id) });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices - create an invoice: { clientName, items: [{ desc, amount }], dueDate }
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { clientName, items = [], dueDate } = req.body;
    const total = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    const invoice = {
      clientName,
      items,
      total,
      status: 'unpaid', // unpaid | paid | overdue
      dueDate: dueDate ? new Date(dueDate) : null,
      paidAt: null,
      createdAt: new Date()
    };

    const result = await db.collection('invoices').insertOne(invoice);
    res.json({ success: true, invoiceId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/invoices/:id/pay - mark an invoice as paid (simulated payment collection)
router.put('/:id/pay', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('invoices').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: 'paid', paidAt: new Date() } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('invoices').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;