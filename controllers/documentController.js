const documentModel = require('../models/documentModel');
const { ObjectId } = require('mongodb');

async function createDocument(req, res) {
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
  const result = await documentModel.insertDocument(doc);
  res.json(result);
}

async function viewDocument(req, res) {
  const id = new ObjectId(req.params.id);
  await documentModel.markViewedIfSent(id);
  const doc = await documentModel.getById(id);
  res.json(doc);
}

async function signDocument(req, res) {
  const id = new ObjectId(req.params.id);
  const result = await documentModel.signDocument(id, req.body.signedBy);
  res.json(result);
}

async function declineDocument(req, res) {
  const id = new ObjectId(req.params.id);
  const result = await documentModel.declineDocument(id);
  res.json(result);
}

module.exports = { createDocument, viewDocument, signDocument, declineDocument };