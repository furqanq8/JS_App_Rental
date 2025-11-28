const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    tripDate: { type: Date, required: true },
    locationFrom: { type: String, required: true },
    locationTo: { type: String, required: true },
    fleet: { type: mongoose.Schema.Types.ObjectId, ref: 'Fleet', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    workType: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
