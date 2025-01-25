
 class functionsHandler {


    //----------------------Function to control Log In answer of status code from back end--------------------------------------
    statusLogInController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
        const loginAnswer = document.querySelector(`.login_answer`)
        switch(status) {
            case 200: 
                loginAnswer.innerHTML=`<h1 class="login_answer_text">You have successfully logged in</h1>`
                break;
            case 401:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">Wrong login or password</h1>`
                break;
            case 429:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">Too many requests, please try again later</h1>`
                 break;
            default:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">An error occurred, we are working on it</h1>`
                break;
        }
    }
    //----------------------Function to control Sign Up answer of status code from back end--------------------------------------
    statusSignUpController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
        const loginAnswer = document.querySelector(`.signup_answer`)
        switch(status) {
            case 201: 
                loginAnswer.innerHTML=`<h1 class="login_answer_text">You have successfully registered</h1>`
                break;
            case 400:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">Please check the correctness of the entered data</h1>`
                break;
            case 409:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">Registration failed, please try again</h1>`
                break;
            case 429:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">Too many requests, please try again later</h1>`
                 break;
            default:
                loginAnswer.innerHTML=`<h1 class="login_answer_text">An error occurred, we are working on it</h1>`
                break;
        }
    }


    //---------------------Function for Log In---------------------------------------------------------------------
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

    // ---------------------Function for Sign Up---------------------------------------------------------------------
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


}

export default functionsHandler;