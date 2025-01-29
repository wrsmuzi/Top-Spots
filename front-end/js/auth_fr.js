import {authFunctionsHandler} from "./functions.js"
const Functions = new authFunctionsHandler()


//---------------LOG IN--------------------------------------------
const loginForm=document.getElementById('Login_form')
loginForm.addEventListener('submit', async (event)=>{
    event.preventDefault()
    
    // const formLogIn = document.getElementById('logIn_form')
    
    if(!loginForm.checkValidity()){
        console.log(`LogIn form is not valid`)
        return
    }
    
    const formObj = new FormData(loginForm)
    const inputValues = Object.fromEntries(formObj.entries())
    const {login, password}=inputValues

    if(!login?.trim() || !password.trim()){
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
        console.log(`SignUp form is not valid`)
        return
    }

    const formObj = new FormData(signUpForm)
    const  inputValues = Object.fromEntries(formObj.entries())
    const {username, login, password}= inputValues

    if(!username?.trim() || !login?.trim() || !password?.trim()){
        const signupAnswer = document.querySelector('.block_for_answer_reg')
        return signupAnswer.innerHTML=`<h1 class="answer_text">Usernaame, login and password are required</h1>`
    }
    const sendingData = await Functions.sendSignUp(inputValues)
})

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


   
