const axios = require('axios');

async function getNearbyPlaces(lat, lon, radius = 1500) {
  const query = `
    [out:json];
    (
      node["tourism"="attraction"](around:${radius},${lat},${lon});
      way["tourism"="attraction"](around:${radius},${lat},${lon});
      relation["tourism"="attraction"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data.elements;
  } catch (error) {
    throw new Error('Помилка отримання nearby places');
  }
}

module.exports = { getNearbyPlaces };
