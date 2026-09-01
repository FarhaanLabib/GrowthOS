const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'message', 'note', 'stage-change'], required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const dealSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  stage: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Booked', 'Won', 'Lost'],
    default: 'New Lead'
  },
  value: { type: Number, default: 0 },
  assignedRep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  source: { type: String },
  tags: [{ type: String }],
  lostReason: { type: String },
  activityLog: [activityLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);