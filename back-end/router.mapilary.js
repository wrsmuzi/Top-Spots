const express = require('express');
const axios = require('axios');
const router = express.Router();

const MAPILLARY_TOKEN = 'MLY|9540692052723445|7c07a8d011f4937175d72e3e6650dce2';

async function getMapillaryImage(lat, lon) {
  const radius = 25000; // 25 км
  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,thumb_1024_url&closeto=${lon},${lat}&radius=${radius}&limit=5`;

  try {
    const response = await axios.get(url);
    const images = response.data.data;
    if (images && images.length > 0) {
      return images.map(img => img.thumb_1024_url);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Mapillary API error:', error.message);
    return [];
  }
}

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat і lon потрібні' });
  }
  const images = await getMapillaryImage(parseFloat(lat), parseFloat(lon));
  if (images.length > 0) {
    res.json({ images });
  } else {
    res.status(404).json({ error: 'Фото не знайдено' });
  }
});

module.exports = router;
