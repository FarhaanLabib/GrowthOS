const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  teamMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bufferMinutes: { type: Number, default: 15 },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'confirmed'
  },
  confirmationSent: { type: Boolean, default: false },
  reminder24hSent: { type: Boolean, default: false },
  reminder1hSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
