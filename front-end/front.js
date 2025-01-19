import functionsHandler from "./functions.js"
const Functions = new functionsHandler()


//---------------LOG IN--------------------------------------------
const loginBtn=document.getElementById('login_btn')
loginBtn.addEventListener('click', async (event)=>{
    event.preventDefault()
    
    const formLogIn = document.getElementById('logIn_form')
    
    if(!formLogIn.checkValidity()){
        console.log(`LogIn form is not valid`)
        return
    }
    
    const formObj = new FormData(formLogIn)
    const inputValues = Object.fromEntries(formObj.entries())
    const {login, password}=inputValues

    if(!login?.trim() || !password.trim()){
        const loginAnswer = document.querySelector('.login_answer')
        return loginAnswer.innerHTML=`<h1 class="login_answer_text">Login and password are required</h1>` 
    }
    const sendingData = await Functions.sendLogIn(inputValues);
})


//---------------SIGN UP--------------------------------------------
const signUpForm = document.getElementById('form_signUp')
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
        const signupAnswer = document.querySelector('.signup_answer')
        return signupAnswer.innerHTML=`<h1 class="signup_answer_text">Usernaame, login and password are required</h1>`
    }
    const sendingData = await Functions.sendSignUp(inputValues)
})