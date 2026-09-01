const mongoose = require('mongoose');

const smsCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true, maxlength: 160 },
  segment: {
    tag: { type: String },
    pipelineStage: { type: String },
    location: { type: String }
  },
  scheduledAt: { type: Date },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent'],
    default: 'draft'
  },
  complianceMode: { type: Boolean, default: true }, // auto-append opt-out text on first message per contact
  stats: {
    delivered: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    optOuts: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('SmsCampaign', smsCampaignSchema);
