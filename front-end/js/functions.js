//----------------  Class with functions for auth_fr.js --> authentication.html  -----------------------------------------
 class authFunctionsHandler {
    //---------------------- Function to control Log In answer of status code from back end -----------------------------
    statusLogInController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
        const loginAnswer = document.querySelector(`.block_for_answer_log`)
        switch(status) {
            case 200: 
                loginAnswer.innerHTML=`<h1 class="answer_text">You have successfully logged in</h1>`
                break;
            case 401:
                loginAnswer.innerHTML=`<h1 class="answer_text">Wrong login or password</h1>`
                break;
            case 429:
                loginAnswer.innerHTML=`<h1 class="answer_text">Too many requests, please try again later</h1>`
                 break;
            default:
                loginAnswer.innerHTML=`<h1 class="answer_text">An error occurred, we are working on it</h1>`
                break;
        }
    }
    //---------------------- Function to control Sign Up answer of status code from back end ------------------------
    statusSignUpController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
        const loginAnswer = document.querySelector(`.block_for_answer_reg`)
        switch(status) {
            case 201: 
                loginAnswer.innerHTML=`<h1 class="answer_text">You have successfully registered</h1>`
                break;
            case 400:
                loginAnswer.innerHTML=`<h1 class="answer_text">Please check the correctness of the entered data</h1>`
                break;
            case 409:
                loginAnswer.innerHTML=`<h1 class="answer_text">Registration failed, please try again</h1>`
                break;
            case 429:
                loginAnswer.innerHTML=`<h1 class="answer_text">Too many requests, please try again later</h1>`
                 break;
            default:
                loginAnswer.innerHTML=`<h1 class="answer_text">An error occurred, we are working on it</h1>`
                break;
        }
    }
    //--------------------- Function for Log In -----------------------------------------------------
    sendLogIn = async (obj)=>{
        try{
            const sendingData = await fetch('http://localhost:3500/api/logIn',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            this.statusLogInController(sendingData.status)
          
        }catch(err){
            console.log(`Internal sevrver error`)
            throw new Error(`Problem with server: ${err.statusText}`)
        }
    }
    // --------------------- Function for Sign Up ------------------------------------------------------
    sendSignUp = async (obj)=>{
        try{
            const sendingData = await fetch('http://localhost:3500/api/signUp',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            this.statusSignUpController(sendingData.status)

        }catch(err){
            console.log(`Internal sevrver error`)
            throw new Error(`Problem with server: ${err.statusText}`)
        }
    }
    //-------------------- Function for Controll Password Visibility ---------------------------------------
    controllPasswordVisibility = (passwordField, passwordLockBtn, showPassword, blockPassword)=>{
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Show password
        passwordLockBtn.style.opacity = "0";
        setTimeout(()=>{
            passwordLockBtn.style.backgroundImage = blockPassword;
            passwordLockBtn.style.opacity = "1";
        }, 200)
    } else {
        passwordField.type = "password"; // Block passsword
        passwordLockBtn.style.opacity = "0";
        setTimeout(()=>{
            passwordLockBtn.style.opacity = "1";
            passwordLockBtn.style.backgroundImage = showPassword;
        }, 200)
    }
    }
}



//----------------Class with functions for index_fr.js --> index.html------------------------------------------------------
class indexFunctionsHandler{

}


//--------------Export classes in another files-----------------------------------
export { authFunctionsHandler, indexFunctionsHandler };