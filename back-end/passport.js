const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const session = require('express-session');
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });
const cors = require('cors');  
console.log("🔍 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔍 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("🔍 GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    console.log("👤 Користувач Google:", profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

console.log("🔧 Passport Google Strategy ініціалізовано");

// 🛠 Ось тут виправлення: правильно експортуємо `passport`
module.exports = passport;
