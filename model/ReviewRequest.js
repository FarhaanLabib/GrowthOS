const mongoose = require('mongoose');

const reviewRequestSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  },
  deliveryMethod: {
    type: String,
    enum: ['sms', 'email', 'both'],
    default: 'both'
  },
  platform: {
    type: String,
    enum: ['google', 'facebook', 'custom'],
    default: 'google'
  },
  customUrl: { type: String },
  delayHours: { type: Number, default: 24 },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'opened', 'clicked', 'skipped-optout'],
    default: 'scheduled'
  },
  sentAt: { type: Date },
  openedAt: { type: Date },
  clickedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ReviewRequest', reviewRequestSchema);
