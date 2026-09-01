const mongoose = require('mongoose');

const emailBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ['header', 'text', 'image', 'button', 'divider', 'social'], required: true },
  content: { type: mongoose.Schema.Types.Mixed } // text, image URL, button label/link, etc.
}, { _id: false });

const emailCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectA: { type: String, required: true },
  subjectB: { type: String }, // optional, for A/B testing
  blocks: [emailBlockSchema],
  segment: {
    tag: { type: String },
    pipelineStage: { type: String },
    minLeadScore: { type: Number },
    location: { type: String }
  },
  scheduledAt: { type: Date },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent'],
    default: 'draft'
  },
  stats: {
    sent: { type: Number, default: 0 },
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    unsubscribes: { type: Number, default: 0 },
    bounces: { type: Number, default: 0 },
    revenueAttributed: { type: Number, default: 0 }
  },
  winningSubject: { type: String } // set after A/B test resolves
}, { timestamps: true });

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);
