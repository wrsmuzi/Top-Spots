const express = require('express')
const app = express()
const path = require('path')
const router = require('./router.js')

app.use(express.static(path.join(__dirname, '../Front-end')));
app.use(express.json())
app.use('/', router);







const PORT = 3500;
app.listen(PORT, "localhost",(err)=>{
    if(err)console.log(`Server not working: ${err}`)
        else{console.log(`Server is working on port: http://localhost:${PORT}`)}
})

