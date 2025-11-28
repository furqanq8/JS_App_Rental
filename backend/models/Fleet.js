const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema(
  {
    fleetNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fleet', fleetSchema);
