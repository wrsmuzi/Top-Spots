import {authFunctionsHandler} from "./functions.js"
const Functions = new authFunctionsHandler()


//---------------LOG IN--------------------------------------------
const loginForm=document.getElementById('Login_form')
loginForm.addEventListener('submit', async (event)=>{
    event.preventDefault()
    
    if(!loginForm.checkValidity()){
        return console.log(`LogIn form is not valid`) 
    }
    
    const formObj = new FormData(loginForm)
    const inputValues = Object.fromEntries(formObj.entries())
    const {email, password}=inputValues

    if(!email?.trim() || !password?.trim()){
        const loginAnswer = document.querySelector('.block_for_answer_log')
        return loginAnswer.innerHTML=`<h1 class="answer_text">Login and password are required</h1>` 
    }
    const sendingData = await Functions.sendLogIn(inputValues);
})


//---------------SIGN UP--------------------------------------------
const signUpForm = document.getElementById('Registration_form')
signUpForm.addEventListener('submit', async(event)=>{
    event.preventDefault()

    if(!signUpForm.checkValidity()){
        return console.log(`SignUp form is not valid`) 
    }

    const formObj = new FormData(signUpForm)
    const  inputValues = Object.fromEntries(formObj.entries())
    const {username, email, password}= inputValues

    if(!username?.trim() || !email?.trim() || !password?.trim()){
        const signupAnswer = document.querySelector('.block_for_answer_reg')
        return signupAnswer.innerHTML=`<h1 class="answer_text">Usernaame, login and password are required</h1>`
    }
    Functions.loadingAnimation()
    const sendingData = await Functions.sendSignUp(inputValues)
})
//------------------------------------ Move Login/Register form-----------------------------------------------
document.addEventListener('DOMContentLoaded', ()=>{
    const registerForm = document.getElementById('registratioBlock');
    const loginBlock = document.getElementById('loginBlock')
// from registration in login
    const openLogIn = document.getElementById('openLogIn');
    openLogIn.addEventListener('click', () => {
        registerForm.classList.toggle('auth_active')
        registerForm.classList.toggle('auth_inactive')
        loginBlock.classList.toggle('auth_inactive')
        loginBlock.classList.toggle('auth_active')
  })
// from login in registration
    const openRegisterBtn = document.getElementById('openRegister')
    openRegisterBtn.addEventListener('click', ()=>{
        loginBlock.classList.toggle('auth_active')
        loginBlock.classList.toggle('auth_inactive')
        registerForm.classList.toggle('auth_inactive')
        registerForm.classList.toggle('auth_active')
   })
})

document.addEventListener('DOMContentLoaded', ()=>{
    const img = [
        '../img/auth/photo_2025-01-31_23-28-51.jpg', '../img/auth/photo_2025-01-31_23-28-52.jpg', '../img/auth/photo_2025-01-31_23-28-53.jpg', 
        '../img/auth/photo_2025-01-31_23-28-54.jpg', '../img/auth/photo_2025-01-31_23-28-55.jpg', '../img/auth/photo_2025-01-31_23-28-57.jpg',
        '../img/auth/photo_2025-01-31_23-28-59.jpg', '../img/auth/photo_2025-01-31_23-29-00.jpg', '../img/auth/photo_2025-01-31_23-29-03.jpg', 
        '../img/auth/photo_2025-01-31_23-29-05.jpg', '../img/auth/photo_2025-01-31_23-29-06.jpg', '../img/auth/photo_2025-01-31_23-29-07.jpg',
        '../img/auth/photo_2025-01-31_23-29-08.jpg', '../img/auth/photo_2025-01-31_23-29-09.jpg', '../img/auth/photo_2025-01-31_23-29-10.jpg', 
        '../img/auth/photo_2025-01-31_23-29-11.jpg', '../img/auth/photo_2025-01-31_23-29-12.jpg', '../img/auth/photo_2025-01-31_23-29-13.jpg',
        '../img/auth/photo_2025-01-31_23-29-14.jpg', '../img/auth/photo_2025-01-31_23-29-15.jpg', '../img/auth/photo_2025-01-31_23-29-17.jpg',
        '../img/auth/photo_2025-01-31_23-29-18.jpg', '../img/auth/photo_2025-01-31_23-29-20.jpg', '../img/auth/photo_2025-01-31_23-29-21.jpg',
        '../img/auth/photo_2025-01-31_23-29-22.jpg', '../img/auth/photo_2025-01-31_23-29-23.jpg', '../img/auth/photo_2025-01-31_23-29-24.jpg',
        '../img/auth/photo_2025-01-31_23-29-25.jpg', '../img/auth/photo_2025-01-31_23-29-26.jpg', '../img/auth/photo_2025-01-31_23-29-27.jpg',
        '../img/auth/photo_2025-01-31_23-29-28.jpg', '../img/auth/photo_2025-01-31_23-29-29.jpg', '../img/auth/photo_2025-01-31_23-39-41.jpg'
    ]
        const randomImage = img[Math.floor(Math.random() * img.length)];

        const imgBlock = document.querySelector('.right_main_img');
        
        if (imgBlock) {
            imgBlock.src = randomImage;
        }
})

// ---------------------Show and lock password---------------
//Show and lock in register
const regPasswordField = document.getElementById('regPassword');
const regCheckVsbBtn = document.querySelector('.reg_password_visibility_btn');
regCheckVsbBtn.addEventListener('click', () => {
    const showPassword = "url('../img/opened-Eyes.png')";
    const blockPassword = "url('../img/closed-Eyes.png')";
    Functions.controllPasswordVisibility(regPasswordField, regCheckVsbBtn, showPassword, blockPassword);
});
//Show and lock in log in
const logpasswordField = document.getElementById('logPassword');
const logCheckVsbBtn = document.querySelector('.log_password_visibility_btn');
logCheckVsbBtn.addEventListener('click', () => {
    const showPassword = "url('../img/opened-Eyes.png')";
    const blockPassword = "url('../img/closed-Eyes.png')";
    Functions.controllPasswordVisibility(logpasswordField, logCheckVsbBtn, showPassword, blockPassword);
});




   
