const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const pool = require('./database') 



class Controller {

    pageMain = path.join(__dirname, '../Front-end/index.html') 
    pageError = path.join(__dirname, '../front-end/error.html')


    //Open Main page
    openMainPage = (req, res)=>{
        try{
            res.sendFile(this.pageMain,(err)=>{
                if(err){
                    console.log(`Problem with sending Main page: ${err}`)
                    res.status(404).json()
                    return
                }
                res.status(200)
                console.log(`Main page successfully opened`)
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json()
        }
    }

    //Open Error page
    openErrorPage = (req, res)=>{
        try{
            res.sendFile(this.pageError, (err)=>{
                if(err){
                    console.log(`Problem with sending Error page: ${err}`)
                    res.status(400).json()
                    return
                }
                res.status(200)
                console.log(`Error page ssuccessful opened`)
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json()
        }
    }


    //Registration
    signUp = async (req, res) =>{
        const{username, login, password}=req.body
        const saltLvl=10

        if (!username || !login || !password) {
            console.log(`Username, Login and password are required`)
            return res.status(400).json();
        }
        const existUser = await pool.query(`SELECT * FROM users WHERE login = ($1)`,[login])
        if(existUser.rowCount>0){
            console.log(`User with this email or phone number ${existUser.rows[0].email_address} are already exist,`)
            return res.status(409).json()
        }
        try{
            const hashedPassword = await bcrypt.hash(password, saltLvl)
            console.log(`Hashed password: ${hashedPassword}`)

            const creatingUser = await pool.query(`INSERT INTO users (username, login, password) VALUES ($1, $2, $3) RETURNING user_id`,[username, login, hashedPassword])
            if(creatingUser.rowCount===0){
                console.log(`Problem with creating user in Database`)
                res.status(400).json()
                return
            }
            res.status(201).json()
        }catch(err){
            console.log(`Problem with server`)
            res.status(500).json()
        }
    }

    //Log in 
    logIn = async (req, res)=>{
        const{login, password}=req.body
        if(!login || !password){
            console.log(`User have not entered login or password`)
            return res.status(400).json()
        }
        try{
            const dataBaseUserInf = await pool.query(`SELECT * FROM users WHERE login = ($1)`,[login])
            if(dataBaseUserInf.rowCount===0){
                console.log(`User with this login ${login} is not exist`)
                return res.status(401).json()
            }
            const user = dataBaseUserInf.rows[0]
            const IsMatchPassword = await bcrypt.compare(password, user.password)
            if(!IsMatchPassword){
                console.log(`User have entered wrong password`)
                return res.status(401).json()
            }
            console.log(`User with this login ${login} successfully logged in`)
            return res.status(200).json()

        }catch(err){
            console.log(`Problem with server, cause: ${err}`)
            return res.status(500).json()
        }
    }
}

module.exports = Controller