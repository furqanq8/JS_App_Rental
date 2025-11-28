const express = require('express');
const Fleet = require('../models/Fleet');

const router = express.Router();

// Create fleet
router.post('/', async (req, res) => {
  try {
    const fleet = new Fleet(req.body);
    const saved = await fleet.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all fleet
router.get('/', async (req, res) => {
  try {
    const fleets = await Fleet.find();
    res.json(fleets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single fleet
router.get('/:id', async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) return res.status(404).json({ error: 'Fleet not found' });
    res.json(fleet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fleet
router.put('/:id', async (req, res) => {
  try {
    const updated = await Fleet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Fleet not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete fleet
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Fleet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Fleet not found' });
    res.json({ message: 'Fleet deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
