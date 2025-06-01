// router-reviews.js
const express = require('express');
const router = express.Router();

// Тимчасово збереження в памʼяті (для прикладу)
let reviews = [];

// Отримати всі відгуки для місця
router.get('/:locationId', (req, res) => {
  const locationId = req.params.locationId;
  const filtered = reviews.filter(r => r.locationId === locationId);
  res.json(filtered);
});

// Додати відгук
router.post('/', (req, res) => {
  const { locationId, user, comment, rating } = req.body;
  if (!locationId || !user || !comment || !rating) {
    return res.status(400).json({ error: 'Всі поля обовʼязкові' });
  }
  const newReview = {
    id: Date.now().toString(),
    locationId,
    user,
    comment,
    rating,
    date: new Date()
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Видалити відгук
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Відгук не знайдено' });
  reviews.splice(index, 1);
  res.json({ message: 'Відгук видалено' });
});

module.exports = router;
