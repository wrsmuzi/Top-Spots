const express = require('express'); // Імпортуємо Express
const router = express.Router();
const Controller = require('./controller.js')
const controller = new Controller()




router.use('/',controller.openMainPage)

module.exports = router