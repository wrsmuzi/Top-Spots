const express = require('express'); 
const router = express.Router();
const passport = require('./passport.js'); // 🔥 Додаємо імпорт passport
const Controller = require('./controller.js');
const controller = new Controller();

router.get('/', controller.openBaseMainPage);
router.get('/checkUser', controller.openAuthPage);
router.get('/api/verify-email', controller.emailVerify);
router.post('/resent-email', controller.resentEmail);
router.get('/email-confirmition', controller.openEmailConfirmation);
router.post('/api/signUp', controller.signUp);
router.post('/api/logIn', controller.logIn);

router.post('/logOut', controller.checkValidityAccessToken, controller.logOut);
// router.post('/logOut', );

router.get('/new-main', controller.checkValidityAccessToken);
router.get('/new-main', controller.openFullMainPage);


router.get('/auth/google', (req, res, next) => {
    console.log("➡️ Запит на /auth/google отримано");

    const middleware = passport.authenticate('google', { scope: ['profile', 'email'] });

    console.log("⚡ Викликаємо passport.authenticate...");
    
    return middleware(req, res, next);
});

router.get('/auth/google/callback', 
    (req, res, next) => {
        console.log('🔄 Отримано запит на /auth/google/callback');
        next();
    }, 
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
        console.log('✅ Google OAuth успішний!');
        console.log('👤 Користувач:', req.user);
        res.redirect('/profile');
    }
);

router.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/google');
    }
    res.json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

router.use('*', controller.openErrorPage);

module.exports = router;
