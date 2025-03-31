const express = require('express')
const app = express()
const path = require('path')
const router = require('./router.js')
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport.js'); 
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

// ✅ Перемістити `session()` вище за `passport.initialize()`
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 

app.use(cookieParser());

// Статичні файли
app.use(express.static(path.join(__dirname, '../Front-end'), { cacheControl: false, etag: false, maxAge: 0 }));

// Роутер
app.use('/', router);   

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, (err) => {
    if (err) console.log(`Server not working: ${err}`);
    else console.log(`Server is working on: http://${HOST}:${PORT}`);
});
