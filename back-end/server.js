// 🔧 server.js
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport.js');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });

const nominatimRouter = require('./router.nominatim.js');
const router = require('./router.js');
const reviewsRouter = require('./router-reviews.js');
const mapillaryRouter = require('./router.mapilary.js');
const nearbyApiRouter = require('./router.nearby.js');
const wikipediaRouter = require('./router.wikipedia.js');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../Front-end')));

// 🧭 Маршрути
app.use('/', router);
app.use('/reviews', reviewsRouter);
app.use('/api/mapillary', mapillaryRouter);
app.use('/api/nearby', nearbyApiRouter);
app.use('/api/nominatim', nominatimRouter);
app.use('/api/wikipedia', wikipediaRouter);
// ▶️ Запуск сервера
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
