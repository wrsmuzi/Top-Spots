const express = require('express')
const app = express()
const path = require('path')
const router = require('./router.js')
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });

app.use(express.static(path.join(__dirname, '../Front-end')));
app.use(express.json())

app.use(cors());

app.use('/', router);

const PORT = process.env.PORT
const HOST = process.env.HOST

app.listen(PORT, HOST,(err)=>{
    if(err)console.log(`Server not working: ${err}`)
        else{console.log(`Server is working on port: http://${HOST}:${PORT}`)}
})

