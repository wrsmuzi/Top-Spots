const express = require('express'); 
const router = express.Router();
const Controller = require('./controller.js')
const controller = new Controller()


router.get('/', controller.openMainPage)
router.get('/checkUser', controller.openAuthPage)

router.get('/api/verify-email', controller.emailVerify)
router.post('/resent-email', controller.resentEmail)
router.get('/email-confirmition', controller.openEmailConfirmation)

router.post('/api/signUp', controller.signUp)
router.post('/api/logIn',controller.logIn)

router.get('/api/logIn',controller.logIn)

router.get('/new-main', controller.checkValidityAccessToken)
router.get('/new-main', controller.openNewMainPage)


module.exports = router