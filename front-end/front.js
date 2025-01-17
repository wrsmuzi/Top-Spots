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
    if(!login?.trim()==="" || !password.trim()===""){
        console.log(`User have not entered login or password`)
        //Треба блок для html
        return
    }
    else{
        console.log(`Front.js opened`)
    }
    const sendingData = await Functions.sendLogIn(inputValues);

    


    

})