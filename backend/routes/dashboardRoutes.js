const express = require('express');
const Trip = require('../models/Trip');

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const { fromDate, toDate, driverId, customerId } = req.query;

    const match = {};

    if (fromDate || toDate) {
      match.tripDate = {};
      if (fromDate) match.tripDate.$gte = new Date(fromDate);
      if (toDate) match.tripDate.$lte = new Date(toDate);
    }

    if (driverId) match.driver = driverId;
    if (customerId) match.customer = customerId;

    const [summary] = await Trip.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const tripsPerDriver = await Trip.aggregate([
      { $match: match },
      { $group: { _id: '$driver', tripCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'drivers',
          localField: '_id',
          foreignField: '_id',
          as: 'driver',
        },
      },
      { $unwind: { path: '$driver', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          driverId: '$_id',
          driverName: '$driver.name',
          tripCount: 1,
        },
      },
    ]);

    const tripsPerCustomer = await Trip.aggregate([
      { $match: match },
      { $group: { _id: '$customer', tripCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          customerId: '$_id',
          customerName: '$customer.customerName',
          companyName: '$customer.companyName',
          tripCount: 1,
        },
      },
    ]);

    res.json({
      totalTrips: summary?.totalTrips || 0,
      totalAmount: summary?.totalAmount || 0,
      tripsPerDriver,
      tripsPerCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
