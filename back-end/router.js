const express = require('express'); // Імпортуємо Express
const router = express.Router();
const Controller = require('./controller.js')
const controller = new Controller()


router.get('/', controller.openMainPage)
router.post('/api/registration', controller.signUp)
router.post('/api/logIn',controller.logIn)




router.use('*', controller.openErrorPage)


module.exports = router