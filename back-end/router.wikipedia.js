const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'Потрібен city' });

  try {
    const searchRes = await axios.get('https://uk.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: city,
        format: 'json',
        origin: '*',
        utf8: 1,
      }
    });
    const results = searchRes.data.query.search;
    if (results.length === 0) {
      return res.json({ description: 'Опис не знайдено', population: 'Дані відсутні', pageid: null });
    }
    const pageTitle = results[0].title;

    const extractRes = await axios.get('https://uk.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: pageTitle,
        format: 'json',
        origin: '*',
        utf8: 1,
      }
    });

    const pages = extractRes.data.query.pages;
    const page = pages[Object.keys(pages)[0]];
    const description = page.extract || 'Опис не знайдено';

    // Населення можна розширити через wikidata, але зараз - "Дані відсутні"
    res.json({ description, population: 'Дані відсутні', pageid: page.pageid || null });

  } catch (e) {
    console.error('Wikipedia API error:', e.message);
    res.status(500).json({ error: 'Помилка Wikipedia API' });
  }
});

module.exports = router;
