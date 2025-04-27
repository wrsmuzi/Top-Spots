const pool = require('./database.js'); // твій pool для підключення до бази
const fakeNames = ["Олександр", "Марія", "Іван", "Наталія", "Петро"];
const fakeComments = [
  "Дуже гарне місце!",
  "Сподобалося, рекомендую.",
  "Тут дуже затишно і красиво.",
  "Чудова атмосфера!",
  "Обов'язково ще повернуся сюди!"
];

exports.getReviews = async (req, res) => {
  const { place } = req.query;
  const result = await pool.query('SELECT * FROM reviews WHERE place_name = $1', [place]);

  let reviews = result.rows;

  if (reviews.length < 3) {
    while (reviews.length < 3) {
      reviews.push({
        user_name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        comment: fakeComments[Math.floor(Math.random() * fakeComments.length)]
      });
    }
  }

  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const { place_name, user_name, rating, comment } = req.body;
  await pool.query('INSERT INTO reviews (place_name, user_name, rating, comment) VALUES ($1, $2, $3, $4)', [place_name, user_name, rating, comment]);
  res.sendStatus(201);
};
