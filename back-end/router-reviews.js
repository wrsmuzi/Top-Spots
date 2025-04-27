// rewiews-router.js
const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('./rewiews-controller');

router.get('/reviews', getReviews);
router.post('/reviews', createReview);

module.exports = router;
