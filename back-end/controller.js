const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const pool = require('./database');
require('dotenv').config({ path: path.resolve(__dirname, './privateInf.env') });

class Controller {
    pageBaseMain = path.join(__dirname, '../Front-end/html/index.html');
    pageFullMain = path.join(__dirname, '../Front-end/html/mainpage.html');
    pageError = path.join(__dirname, '../front-end/html/error.html');
    pageAuth = path.join(__dirname, '../front-end/html/authentication.html');
    pageEmailConfirmation = path.join(
        __dirname,
        '../front-end/html/email_confirmation.html',
    );

    //Open Main page
    openBaseMainPage = (req, res) => {
        try {
            res.sendFile(this.pageBaseMain, (err) => {
                if (err) {
                    console.log(`Problem with sending Main page: ${err}`);
                    return res.status(404).json();
                }
                console.log(`Main page successfully opened`);
                res.status(200);
            });
        } catch (err) {
            console.log(`Problem with server or bad request: ${err}`);
            res.status(500).json();
        }
    };
    //Open New Main page
    openFullMainPage = (req, res) => {
        try {
            res.sendFile(this.pageFullMain, (err) => {
                if (err) {
                    console.log(`Problem with sending New Main page: ${err}`);
                    return res.status(404).json();
                }
                console.log(`New Main page successfully opened`);
                res.status(200);
            });
        } catch (err) {
            console.log(`Problem with server or bad request: ${err}`);
            res.status(500).json();
        }
    };

    //Open Error page
    openErrorPage = (req, res) => {
        try {
            res.sendFile(this.pageError, (err) => {
                if (err) {
                    console.log(`Problem with sending Error page: ${err}`);
                    return res.status(400).json();
                }
                console.log(`Error page ssuccessful opened`);
                res.status(200);
            });
        } catch (err) {
            console.log(`Problem with server or bad request: ${err}`);
            res.status(500).json();
        }
    };

    //Open Auth page
    openAuthPage = (req, res) => {
        try {
            res.sendFile(this.pageAuth, (err) => {
                if (err) {
                    console.log(`Problem with sending Auth page: ${err}`);
                    return res.status(400).json();
                }
                console.log(`Auth page ssuccessful opened`);
                res.status(200);
            });
        } catch (err) {
            console.log(`Problem with server or bad request: ${err}`);
            res.status(500).json();
        }
    };

    //Open Email Confirmation page
    openEmailConfirmation = (req, res) => {
        try {
            res.sendFile(this.pageEmailConfirmation, (err) => {
                if (err) {
                    console.log(
                        `Problem with sending Email Confirmation page: ${err}`,
                    );
                    return res.status(400).json();
                }
                console.log(`Email Confirmation page ssuccessful opened`);
                res.status(200);
            });
        } catch (err) {
            console.log(`Problem with server or bad request: ${err}`);
            res.status(500).json();
        }
    };

    // Creating JWT Token and sending to Data BASE
    creatingJwtAccRefTokens = async (username, email) => {
        try {
            const accessTokenPayload = {
                username,
                email,
                iat: Math.floor(Date.now() / 1000), // Time when Token was created
                exp: Math.floor(Date.now() / 1000) + 1 * 60, // Time when Token will unvalid
            };
             const refreshTokenPayload = {
                 username,
                 email,
                 iat: Math.floor(Date.now() / 1000), // Time when Token was created
                 exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // Time when Token will unvalid
             };
            const accessToken = jwt.sign(accessTokenPayload, process.env.ACCESSJWTTOKEN);
            const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESHJWTTOKEN);
            const saveToken = await pool.query(
                `
                    INSERT INTO "JWTRefreshToken" (refresh_token) 
                    VALUES ($1) 
                    ON CONFLICT (refresh_token) 
                    DO UPDATE SET refresh_token = EXCLUDED.refresh_token 
                    RETURNING reftoken_id`,
                [refreshToken],
            );
            if (saveToken.rowCount === 0) {
                console.log(`Refresh Token have not saved in Database`);
                return { refreshToken: null, accessToken: null };
            }
            const refTokenId = saveToken.rows[0].reftoken_id;
            const updateRefToken = await pool.query(
                `UPDATE "Users" SET reftoken_id = $1 WHERE email = $2 RETURNING user_id`,
                [refTokenId, email],
            );
            if (updateRefToken.rowCount === 0) {
                return console.log(
                    `Refresh Token have not updated in Users table`,
                );
            }
            console.log(`Refresh Token is saved in Database`);
            return { refreshToken, accessToken };
        } catch (err) {
            console.log(`Error with creating JWT tokens: ${err}`);
            return;
        }
    };

    //Sending Email
    sendingEmail = async (to, subject, htmlEmailContent) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAILSENDER, //  My Email
                    pass: process.env.GOOGLEAPPPASSWORD, //  Google App Password
                },
            });

            const emailOptions = {
                from: process.env.EMAILSENDER,
                to,
                subject,
                html: htmlEmailContent,
            };

            const sending = await transporter.sendMail(emailOptions);
            console.log(`Email sent: ${sending.response}`);
        } catch (err) {
            console.log(`Error sending email: ${err}`);
        }
    };
    // Email Letter Html content
    emailLetterContent = (username, token) => {
        return `
             <div style="width: 100%; height: 100%;">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="width: 100%;">
                <tr align="center" style="background-color: #000;">
                    <td>
                       <div style="width: 25%; height: 20%;">
                           <img src="https://imgur.com/r43Fdc9.png" alt="" style="width: 100%; height: 100%;">
                        </div>
                    </td>
                </tr>
                <tr align="center" style="background: linear-gradient(to right, #010425, #210275);">
                   <td>
                        <div style="width: 100px; height: 100px;">
                           <img src="https://imgur.com/LwI45Wj.png" alt="" style="width: 100%; height: 100%;">
                        </div>
                   </td>
                 </tr>
                 <tr >
                    <td style="padding: 0px 5% 8% 5%; color: #000;" >
                       <table> 
                             <tr align="center" style="font-size: 25px">
                                <td>
                                   <h2>Email Confirmation</h2>
                                </td>
                             </tr>
                             <tr>
                                <td >
                                   <p style="font-size: 20px; letter-spacing: 1.5px; color: #000;">Hi <span style="color:rgb(22, 0, 80);">${username}</span>, <br> <span style="font-size: 20px; letter-spacing: 1.5px; color: #000;">you're almost set to start enjoying our service. Simply click the link below to verify your email address and get started. The link expires in 24 hours.</span></p>
                                </td>
                             </tr>
                             <tr align="center">
                                <td style="padding: 15px 0px;">
                                   <a href="http://localhost:3500/api/verify-email?token=${token}"  style="background: linear-gradient(to right, #010425, #210275); padding: 1.5% 3.5%; letter-spacing: 2px; color:#eeeeee; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 20px; font-weight: 550; text-decoration: none;">Verify my Email</a>
                                </td>
                             </tr>
                             <tr>
                                <td style="padding-top: 10px;">
                                <p style="font-size: 18px; letter-spacing: 1.5px; font-weight: 500;">If you did not request this email verification, please ignore this message. No further action is required.</p>
                                </td>
                             </tr>
                             <tr align="center">
                                <td align="center" style="font-size: 14px; color: #666; padding-top: 40px;">
                                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                    <tr>
                                       <td width="40%">
                                       <div style="width: 100%; height: 3px; background: linear-gradient(to left,rgb(156, 154, 154),rgb(255, 255, 255));"></div>
                                       </td>
                                       <td align="center" style="width: 20%; font-weight: 500; font-size: 18px; color: #000; letter-spacing: 2px; padding: 0 5px; white-space: nowrap;">Social Media</td>
                                       <td width="40%">
                                       <div style="width: 100%; height: 3px; background: linear-gradient(to right,rgb(156, 154, 154),rgb(255, 255, 255));"></div>
                                       </td>
                                    </tr>
                                  </table>
                                </td>
                             </tr>
                            <tr align="center">
                              <td style="padding-top: 10px;">
                                 <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                    <tr>
                                       <td align="center" width="10%" style="text-align: right;">
                                          <a href="https://www.facebook.com/" target="_blank" >
                                            <img src="https://imgur.com/3LjMEoc.png" alt="Facebook" width="25" height="25" style="display: block;  border-radius: 45px; margin-left: auto;">
                                          </a>
                                       </td>
                                       <td align="center" width="10%">
                                         <a href="https://www.youtube.com/" target="_blank">
                                           <img src="https://imgur.com/PATYsSx.png" alt="YouTube" width="25" height="25" style="display: block;  border-radius: 45px;">
                                         </a>
                                       </td>
                                       <td align="center" width="10%" style="text-align: left;">
                                         <a href="https://www.instagram.com/" target="_blank">
                                           <img src="https://imgur.com/NqwvKkM.png" alt="Tik Tok" width="25" height="25" style="display: block; border-radius: 45px; margin-right: auto;">
                                         </a>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                            </tr>
                            <tr>
                               <td align="center">
                                  <p style="font-size: 16px; letter-spacing: 1px; color: #000;">Follow our social media for updates and great offers</p>
                               </td>
                            </tr>
                             <tr>
                               <td align="center" style="background-color: #000; padding: 10px 10px;">
                                  <p style="font-size: 15px; letter-spacing: 1px; color: #fff; font-weight: 600; margin: 0px;">Top Spots</p>
                                  <p style="font-size: 12px; letter-spacing: 1px; color: rgb(230, 188, 4); margin: 0px;">Discover The best Around You</p>
                               </td>
                            </tr>
                       </table>
                    </td>
                 </tr>
              </table>`;
    };
    //Email Varification
    emailVerify = async (req, res) => {
        try {
            const { token } = req.query;
            if (!token) {
                console.log(`EVToken is failed, can't to verify email`);
                return;
            }
            const checkToken = await pool.query(
                `SELECT evtoken_id FROM "EVToken" where ev_token = $1`,
                [token],
            );
            if (checkToken.rowCount === 0) {
                console.log(
                    `Database has no this token, so wew can't conform email`,
                );
                return;
            }
            const chekedTokenId = checkToken.rows[0].evtoken_id;
            console.log(`Token id: ${chekedTokenId}`);

            const isVerified = await pool.query(
                `UPDATE "Users" SET is_verified = true WHERE evtoken_id = $1 RETURNING is_verified, email, username`,
                [chekedTokenId],
            );
            if (isVerified.rowCount === 0) {
                console.log(`Problem with updating isVerified`);
                return;
            }
            const verificationStatus = isVerified.rows[0].is_verified;
            console.log(
                `Verification is completed, is Verified = ${verificationStatus}`,
            );

            const username = isVerified.rows[0].username;
            const email = isVerified.rows[0].email;

            const { refreshToken, accessToken } =
                await this.creatingJwtAccRefTokens(username, email);
            if (!refreshToken || !accessToken) {
                console.log(`Error: JWT tokens were not created properly`);
                return res
                    .status(500)
                    .json({ error: 'JWT token generation failed' });
            }
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Defend from XSS
                secure: false, // Only  HTTPS
                sameSite: 'Strict' // Defend from CSRF
                // maxAge: 7 * 24 * 60 * 60 * 1000, // Alive time
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true, // Defend from XSS
                secure: false, // Only  HTTPS
                sameSite: 'Strict' // Defend from CSRF
                // maxAge: 2 * 60 * 1000, // Alive time
            });

            // res.status(200).json({accessToken})
            res.redirect('/email-confirmition');
        } catch (err) {
            console.log(
                `Problem with confirmation EVtoken or updating isVerified: ${err}`,
            );
            res.status(500).json();
        }
    };
    // Resent email btn
    resentEmail = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            console.log(`Email are required`);
            return res.status(400).json();
        }
        const userInf = await pool.query(
            `SELECT username, evtoken_id FROM "Users" WHERE email = $1`,
            [email],
        );
        if (userInf.rowCount === 0) {
            console.log(`We have not this email in database`);
            return;
        }
        const username = userInf.rows[0].username;
        const tokenId = userInf.rows[0].evtoken_id;
        const evtokenInf = await pool.query(
            `SELECT ev_token FROM "EVToken" WHERE evtoken_id = $1`,
            [tokenId],
        );
        if (evtokenInf.rowCount === 0) {
            console.log(`We have not found evtoken in database`);
            return;
        }
        const EmailVereficationToken = evtokenInf.rows[0].ev_token;

        const emailContent = this.emailLetterContent(
            username,
            EmailVereficationToken,
        );
        await this.sendingEmail(email, 'Email Confirmation', emailContent);
        res.status(201).json({ createdEmail: email });
    };

    //Registration
    signUp = async (req, res) => {
        const { username, email, password } = req.body;
        const saltLvl = 10;

        if (!username || !email || !password) {
            console.log(`Username, Login and password are required`);
            return res.status(400).json();
        }
        const existUser = await pool.query(
            `SELECT * FROM "Users" WHERE email = ($1)`,
            [email],
        );
        if (existUser.rowCount > 0) {
            console.log(
                `User with this email or phone number ${existUser.rows[0].email} are already exist,`,
            );
            return res.status(409).json({ createdEmail: 'error@gmail.com' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, saltLvl);
            console.log(`Hashed password: ${hashedPassword}`);

            //Creating Email Verification Token
            const EmailVereficationToken = crypto
                .randomBytes(32)
                .toString('hex');
            const creatingEVToken = await pool.query(
                'INSERT INTO "EVToken" (ev_token) VALUES ($1) RETURNING evtoken_id',
                [EmailVereficationToken],
            );
            const EVToken = creatingEVToken.rows[0]?.evtoken_id || null;
            if (!EVToken) {
                console.log('Error creating evtoken');
                res.status(500).json();
                return;
            }
            //Creating/Sending User and EVToken in database
            const creatingUser = await pool.query(
                `INSERT INTO "Users" (username, email, password, evtoken_id) VALUES ($1, $2, $3, $4) RETURNING user_id`,
                [username, email, hashedPassword, EVToken],
            );
            if (creatingUser.rowCount === 0) {
                console.log(
                    `Problem with creating user or evtoken in Database`,
                );
                res.status(400).json();
                return;
            }
            //Sending Email Confirmation
            const emailContent = this.emailLetterContent(
                username,
                EmailVereficationToken,
            );
            await this.sendingEmail(email, 'Email Confirmation', emailContent);
            res.status(201).json({ createdEmail: email });
        } catch (err) {
            console.log(`Problem with server, ${err}`);
            res.status(500).json();
        }
    };
    //Log in
    logIn = async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log(`User have not entered login or password`);
            return res.status(400).json();
        }
        try {
            const dataBaseUserInf = await pool.query(
                `SELECT * FROM "Users" WHERE email = ($1)`,
                [email],
            );
            if (dataBaseUserInf.rowCount === 0) {
                console.log(`User with this email ${email} is not exist`);
                return res.status(401).json();
            }
            const user = dataBaseUserInf.rows[0];
            const IsMatchPassword = await bcrypt.compare(
                password,
                user.password,
            );
            if (!IsMatchPassword) {
                console.log(`User have entered wrong password`);
                return res.status(401).json();
            }
            const { refreshToken, accessToken } =
                await this.creatingJwtAccRefTokens(user.username, user.email);
            if (!refreshToken || !accessToken) {
                console.log(`Error: JWT tokens were not created properly`);
                return res
                    .status(500)
                    .json({ error: 'JWT token generation failed' });
            }

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Defend from XSS
                secure: false, // Only  HTTPS
                sameSite: 'Strict' // Defend from CSRF
                // maxAge: 7 * 24 * 60 * 60 * 1000, // Alive time
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true, // Defend from XSS
                secure: false, // Only  HTTPS
                sameSite: 'Strict' // Defend from CSRF
                // maxAge: 2 * 60 * 1000, // Alive time
            });

            console.log(`User with this email ${email} successfully logged in`);
            // next();
            // this.openFullMainPage(req, res);
            // res.redirect(`/new-main`);
            res.status(200).json({redirectUrl:'/new-main'});
             
        } catch (err) {
            console.log(`Problem with server, cause: ${err}`);
            return res.status(500).json();
        }
    };
    //Clear Cookies
    clearCookies = (res) => {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
            // maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
            // maxAge: 2 * 60 * 1000,
        });
    };
    //Log Out
    //!---------------------------------------------------------------------------------------------------------------------
    logOut = async (req, res) => {
        console.log(`Log out is working`);
        try {
            const refreshToken = req.cookies.refreshToken;
            console.log(`Received refreshToken:`, refreshToken); // Лог значення
            if (!refreshToken) {
                console.log('No refresh token found in cookies');
                this.clearCookies(res);
                return res.redirect('/checkUser');
            }
            const response = await pool.query(
                `UPDATE "JWTRefreshToken" 
                    SET refresh_token = NULL
                    WHERE refresh_token = $1 
                    RETURNING *`,
                [refreshToken]
            );
            if (response.rowCount > 0) {
                console.log(`Refresh Token is deleted from Database`);
            } else {
                console.log(`Refresh Token is not deleted from Database`);
            }
            this.clearCookies(res);
            console.log(`Redirecting user to checkUser`)
            return res.status(200).json({redirectUrl:'/checkUser'});
        } catch (err) {
            console.error(`Logout process failed:${err}`);
            return res.status(500).json({ message: 'Internal server error during logout'});
        }
    };

    //Middleware to check Validity Access and Refresh Tokens
    checkValidityAccessToken = async (req, res, next) => {
        try {
            const accessToken = req.cookies.accessToken;
            // if (!accessToken) {
            //     console.log(`Access token is not defined`);
            //     return res
            //         .status(401)
            //         .json({ message: 'Access token missing'});
            // }
            jwt.verify(
                accessToken,
                process.env.ACCESSJWTTOKEN,
                (err, decoded) => {
                    if (err) {
                        console.log(`The Access Token is not valid`);
                         return this.refreshAccessToken(req, res, next);
                    }
                    const { username, email } = decoded;
                    req.username = username;
                    req.email = email;
                    console.log(`The Access Token is valid`);
                    next();
                }
            );
        } catch (err) {
            console.log(
                `Problem with cheking validity of access token: ${err.message}`,
            );
            res.status(500).json();
        }
    };

    //Refresh Access and Refresh tokens
    refreshAccessToken = async (req, res, next) => {
        try {
            //Get Refresh Token from Cookies
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                console.log(`Refresh token is missing in cookies`);
                this.clearCookies(res);
                return res.redirect('/checkUser');
            }
            // Decoding Token to get Info about User
            let decodedRefreshToken;
            try {
                decodedRefreshToken = jwt.verify(
                    refreshToken,
                    process.env.REFRESHJWTTOKEN,
                );
            } catch (err) {
                console.log(`Decoding users refresh token is failed: ${err}`);
                const response = await pool.query(
                   `UPDATE "JWTRefreshToken" 
                    SET refresh_token = NULL
                    WHERE refresh_token = $1 
                    RETURNING *`,
                    [refreshToken],
                );
                if (response.rowCount > 0) {
                    console.log(`Refresh Token is deleted from Database`);
                } else {
                    console.log(`Refresh Token is not deleted from Database`,);
                }
                this.clearCookies(res);
                return res.redirect('/checkUser');
            }
            const { username, email } = decodedRefreshToken;
            console.log(
                `Refresh token decoded successfully for user: ${username}, email: ${email}`,
            );

            //Check if this RefreshToken exists in the Database
            const checkTokenPayload = await pool.query(`
            SELECT jt.reftoken_id 
            FROM "JWTRefreshToken" jt 
            JOIN "Users" u 
            ON U.reftoken_id = jt.reftoken_id 
            WHERE u.email = $1 AND jt.refresh_token = $2`,
                [email, refreshToken],
            );

            //If Refresh Token is not in database or invalid, we redirect to login
            if (checkTokenPayload.rowCount === 0) {
                console.log(
                    `Invalid or expired refresh token for user: ${username}, email: ${email}`,
                );
                return res.redirect('/checkUser');
            }

            //Creating ans sending Access Token to user
            const accessToken = jwt.sign(
                {
                    username,
                    email,
                    iat: Math.floor(Date.now() / 1000), // Time when Token was created
                    exp: Math.floor(Date.now() / 1000) + 7 * 60 // Time when Token will unvalid
                },
                process.env.ACCESSJWTTOKEN,
            );
            console.log(`New Access Token: ${accessToken} generated for user: ${username}, email: ${email}`);
            res.cookie('accessToken', accessToken, {
                httpOnly: true, // Defend from XSS
                secure: false, // Only  HTTPS
                sameSite: 'Strict'// Defend from CSRFDFF
                // maxAge: 2 * 60 * 1000, // Alive time
            });
            req.cookies.accessToken = accessToken
            await this.checkValidityAccessToken(req, res, next);
            res.status(200);
            // res.status(200).json({ message: 'Access token refreshed' });
        } catch (err) {
            console.error(
                `Problem with Refreshing Access or Refresh Tokens: ${err.message}`,
            );
            res.status(500).json({
                message: 'Problem with Refreshing Tokens',
                error: err.message,
            });
        }
    };
}

module.exports = Controller;
