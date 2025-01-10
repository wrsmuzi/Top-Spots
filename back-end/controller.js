const express = require('express')
const path = require('path')





class Controller {

    pageMain = path.join(__dirname, '../Front-end/index.html') 

    openMainPage = (req, res)=>{
        try{
            res.sendFile(this.pageMain,(err)=>{
                if(err){
                    console.log(`Problem with sending Main page: ${err}`)
                    res.status(404).json({message:"Main page not found or problem with opening"})
                    return
                }
                res.status(200)
                console.log(`Main page successful opened`)
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json({message:"Problem with server or bad request"})
        }
    }

}

module.exports = Controller