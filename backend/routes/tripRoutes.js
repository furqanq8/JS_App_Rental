const express = require('express');
const Trip = require('../models/Trip');

const router = express.Router();

// Create trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const saved = await trip.save();
    const populated = await saved.populate('fleet driver customer');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().populate('fleet driver customer');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trip by id
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('fleet driver customer');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
      'fleet driver customer'
    );
    if (!updated) return res.status(404).json({ error: 'Trip not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
