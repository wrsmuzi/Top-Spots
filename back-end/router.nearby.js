const express = require('express');
const router = express.Router();
const { getNearbyPlaces } = require('./nearby');

router.post('/', async (req, res) => {
  const { lat, lon, radius } = req.body;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat і lon потрібні' });
  }
  try {
    const places = await getNearbyPlaces(lat, lon, radius || 1500);
    res.json(places);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
