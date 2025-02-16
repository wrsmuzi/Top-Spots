const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const pool = require('./database') 
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });



class Controller {

    pageMain = path.join(__dirname, '../Front-end/html/index.html') 
    pageError = path.join(__dirname, '../front-end/html/error.html')
    pageAuth = path.join(__dirname, '../front-end/html/authentication.html')
    pageEmailConfirmation = path.join(__dirname,'../front-end/html/email_confirmation.html' )




    //Open Main page
    openMainPage = (req, res)=>{
        try{
            res.sendFile(this.pageMain,(err)=>{
                if(err){
                    console.log(`Problem with sending Main page: ${err}`)
                    return res.status(404).json()
                }
                console.log(`Main page successfully opened`)
                res.status(200)      
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
                    return res.status(400).json()           
                }
                console.log(`Error page ssuccessful opened`)
                res.status(200)         
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json()
        }
    }

    //Open Auth page
    openAuthPage = (req, res)=>{
        try{
            res.sendFile(this.pageAuth, (err)=>{
                if(err){
                    console.log(`Problem with sending Auth page: ${err}`)
                    return res.status(400).json()
                }
                console.log(`Auth page ssuccessful opened`)
                res.status(200)
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json()
        }
    }
    
    //Open Email Confirmation page
    openEmailConfirmation = (req, res)=>{
        try{
            res.sendFile(this.pageEmailConfirmation, (err)=>{
                if(err){
                    console.log(`Problem with sending Email Confirmation page: ${err}`)
                    return res.status(400).json()
                }
                console.log(`Email Confirmation page ssuccessful opened`)
                res.status(200)
            })
        }catch(err){
            console.log(`Problem with server or bad request: ${err}`)
            res.status(500).json()
        }
    }


    //Sending Email
    sendingEmail = async (to, subject, htmlEmailContent) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAILSENDER, //  My Email 
                    pass: process.env.GOOGLEAPPPASSWORD //  Google App Password 
                }
            });
    
            const emailOptions = {
                from: process.env.EMAILSENDER, 
                to, 
                subject, 
                html: htmlEmailContent 
            };
    
            const sending = await transporter.sendMail(emailOptions);
            console.log(`Email sent: ${sending.response}`);
        } catch (err) {
            console.log(`Error sending email: ${err}`);
        }
    };
    // Email Letter Html content
    emailLetterContent = (username, token) =>{
        return `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2>Привіт, ${username}!</h2>
                <p>Дякуємо за реєстрацію. Натисніть на посилання нижче, щоб підтвердити вашу електронну адресу:</p>
                <a href="http://localhost:3500/api/verify-email?token=${token}">Підтвердити ваш емайл</a>
                <p>Якщо ви не реєструвалися, просто ігноруйте цей лист.</p>
            </div>`;
    }
    // Creating JWT Token and sending to Data BASE
    creatingJwtToken = async (evtoken_id) =>{
        const userInf = await pool.query(`SELECT username, email  FROM "Users" WHERE evtoken_id = $1`,[evtoken_id]);
        const username = userInf.rows[0].username
        const email = userInf.rows[0].email
        const payload = {
            username,
            email
        }
        const accessToken = jwt.sign(payload, process.env.ACCESSJWTTOKEN, { expiresIn: "15m" })
        const refreshToken = jwt.sign(payload, process.env.REFRESHJWTTOKEN, { expiresIn: "7d" })
        const saveToken = await pool.query(`INSERT INTO "JWTRefreshToken" (refresh_token) VALUES ($1) RETURNING reftoken_id`,[refreshToken])
        if (saveToken.rowCount === 0) {
            console.log(`Refresh Token have not saved in Database`);
            return { refreshToken: null, accessToken: null };  
        }
        const refTokenId = saveToken.rows[0].reftoken_id;
        const updateRefToken = await pool.query(`UPDATE "Users" SET reftoken_id = $1 WHERE evtoken_id = $2 RETURNING user_id`,[refTokenId, evtoken_id])
        if(updateRefToken.rowCount===0){
            return console.log(`Refresh Token have not updated in Users table`)
        }
        console.log(`Refresh Token is saved in Database`)
        return { refreshToken, accessToken }
    }

    //Email Varification
    emailVerify = async (req, res) =>{
        try{
            const {token}=req.query
            if(!token){
                console.log(`EVToken is failed, can't to verify email`)
                return
            }
            const checkToken = await pool.query(`SELECT evtoken_id FROM "EVToken" where ev_token=$1`,[token])
            if(checkToken.rowCount===0){
                console.log(`Database has no this token, so wew can't conform email`)
                return
            }
            const chekedTokenId = checkToken.rows[0].evtoken_id
            console.log(`Token id: ${chekedTokenId}`)

            const isVerified = await pool.query(`UPDATE "Users" SET is_verified = true WHERE evtoken_id = $1 RETURNING is_verified`,[chekedTokenId])
            if(isVerified.rowCount===0){
                console.log(`Problem with updating isVerified`)
                return
            }
            console.log(`Verification is completed`)
            const verificationStatus = isVerified.rows[0].is_verified
    
            const { refreshToken, accessToken} =  await this.creatingJwtToken(chekedTokenId)
            if (!refreshToken || !accessToken) {
                    console.log(`Error: JWT tokens were not created properly`);
                    return res.status(500).json({ error: "JWT token generation failed" });
            }
            res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,     // Defend from XSS
                    secure: true,       // Only  HTTPS
                    sameSite: "Strict", // Defend from CSRF
                    maxAge: 7 * 24 * 60 * 60 * 1000 // Alive time
            })
            res.cookie("accessToken",accessToken,{
                httpOnly: true,     // Defend from XSS
                secure: true,       // Only  HTTPS
                sameSite: "Strict", // Defend from CSRF
                maxAge: 15 * 60 * 1000  // Alive time

            })
        
            // res.status(200).json({accessToken})
            res.redirect('/email-confirmition');



        }catch(err){
            console.log(`Problem with confirmation EVtoken or updating isVerified: ${err}`)
            res.status(500).json()
        }
    }
    resentEmail = async (req, res) =>{
        const {email}=req.body
        if(!email){
            console.log(`Email are required`)
            return res.status(400).json();
        }
        const userInf = await pool.query(`SELECT evtoken_id FROM "Users" WHERE email = $1`,[email])
        if(userInf.rowCount===0){
            console.log(`We have not this email in database`)
            return
        }
        const username = userInf.rows[0].username
        const tokenId = userInf.rows[0].evtoken_id
        const evtokenInf = await pool.query(`SELECT ev_token FROM "EVToken" WHERE evtoken_id = $1`,[tokenId])
        if(evtokenInf.rowCount===0){
            console.log(`We have not found evtoken in database`)
            return
        }
        const EmailVereficationToken = evtokenInf.rows[0].ev_token

        const emailContent = this.emailLetterContent(username, EmailVereficationToken);
        await this.sendingEmail(email, "Email Confirmation", emailContent);
        res.status(201).json({"createdEmail":email})
    }

    


    //Registration
    signUp = async (req, res) =>{
        const{username, email, password}=req.body
        const saltLvl=10

        if (!username || !email || !password) {
            console.log(`Username, Login and password are required`)
            return res.status(400).json();
        }
        const existUser = await pool.query(`SELECT * FROM "Users" WHERE email = ($1)`,[email])
        if(existUser.rowCount>0){
            console.log(`User with this email or phone number ${existUser.rows[0].email} are already exist,`)
            return res.status(409).json()
        }
        try{
            const hashedPassword = await bcrypt.hash(password, saltLvl)
            console.log(`Hashed password: ${hashedPassword}`)
            
            //Creating Email Verification Token
            const EmailVereficationToken = crypto.randomBytes(32).toString('hex')
            const creatingEVToken = await pool.query('INSERT INTO "EVToken" (ev_token) VALUES ($1) RETURNING evtoken_id', [EmailVereficationToken])
            const EVToken = creatingEVToken.rows[0]?.evtoken_id || null;
            if (!EVToken) {
                console.log("Error creating evtoken");
                res.status(500).json();
                return;
            }
            //Creating/Sending User and EVToken in database
            const creatingUser = await pool.query(`INSERT INTO "Users" (username, email, password, evtoken_id) VALUES ($1, $2, $3, $4) RETURNING user_id`,[username, email, hashedPassword, EVToken])
            if(creatingUser.rowCount===0){
                console.log(`Problem with creating user or evtoken in Database`)
                res.status(400).json()
                return
            }
            //Sending Email Confirmation
            const emailContent = this.emailLetterContent(username, EmailVereficationToken);
            await this.sendingEmail(email, "Email Confirmation", emailContent);
            res.status(201).json({"createdEmail":email})
        }catch(err){
            console.log(`Problem with server, ${err}`)
            res.status(500).json()  
        }
    }

    //Log in 
    logIn = async (req, res)=>{
        const{email, password}=req.body
        if(!email || !password){
            console.log(`User have not entered login or password`)
            return res.status(400).json()
        }
        try{
            const dataBaseUserInf = await pool.query(`SELECT * FROM "Users" WHERE email = ($1)`,[email])
            if(dataBaseUserInf.rowCount===0){
                console.log(`User with this email ${email} is not exist`)
                return res.status(401).json()
            }
            const user = dataBaseUserInf.rows[0]
            const IsMatchPassword = await bcrypt.compare(password, user.password)
            if(!IsMatchPassword){
                console.log(`User have entered wrong password`)
                return res.status(401).json()
            }
            console.log(`User with this email ${email} successfully logged in`)
            return res.status(200).json()

        }catch(err){
            console.log(`Problem with server, cause: ${err}`)
            return res.status(500).json()
        }
    }
}

module.exports = Controller