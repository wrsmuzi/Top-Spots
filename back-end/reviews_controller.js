const pool = require('./database.js');

async function getReviewsFromDB(city, placeType) {
  if (!placeType) return [];

  const query = `
    SELECT city, place_name, place_type, text, rating, created_at
    FROM reviews
    WHERE city = $1 AND place_type = $2
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [city, placeType]);
  return rows;
}

async function addReviewToDB(city, placeName, placeType, text, rating) {
  const query = `
    INSERT INTO reviews(city, place_name, place_type, text, rating, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `;
  await pool.query(query, [city, placeName, placeType, text, rating]);
}

module.exports = {
  getReviewsFromDB,
  addReviewToDB
};
