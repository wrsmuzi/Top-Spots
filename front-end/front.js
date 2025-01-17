import functionsHandler from "./functions.js"
const Functions = new functionsHandler()



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
    else{
        console.log(`Front.js opened`)
    }
    const sendingData = await Functions.sendLogIn(inputValues);

    


    

})