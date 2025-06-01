const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter "q"' });
    }

    // Формуємо URL для Nominatim API
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '10');
    url.searchParams.set('countrycodes', 'ua'); 

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'YourAppName/1.0 (your-email@example.com)' // Обов’язково додай, щоб не блокували запит
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Nominatim API error' });
    }

    const data = await response.json();

    // Відправляємо результат клієнту
    res.json(data);

  } catch (error) {
    console.error('Nominatim error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
