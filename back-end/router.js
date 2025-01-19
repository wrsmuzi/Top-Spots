const express = require('express'); 
const router = express.Router();
const Controller = require('./controller.js')
const controller = new Controller()


router.get('/', controller.openMainPage)
router.post('/api/signUp', controller.signUp)
router.post('/api/logIn',controller.logIn)





router.use('*', controller.openErrorPage)


module.exports = router