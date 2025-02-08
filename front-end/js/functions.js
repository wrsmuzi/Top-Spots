//----------------  Class with functions for auth_fr.js --> authentication.html  -----------------------------------------
 class authFunctionsHandler {
     //--------------------- Function about Offer to Confirm Email -----------------------------------------------------
     offerToConfirmEmail = ()=>{
        const regMainForm = document.querySelector('.registration_main_block')
        const regSubForm = document.querySelector('.registration_sub_block')
        regSubForm.classList.add('invalidRegForm')
        regMainForm.innerHTML=`
       <div class="offerToConfirm_main_block">
            <div class="otc_block_for_img_01">
                <img class="otc_header_img" src="../img/email-6370595_1280.jpg" alt="">
            </div>
            <h1 class="otc_header_text">Email Confirmation</h1>
            <div class="block_for_center_img">
              <div class="otc_block_for_img_02">
                <img class="otc_center_img" src="../img/mail-2048128_640.png" alt="">
              </div>
            </div>
            <div class="otc_block_for_text">
            <p class="otc_sub_text">We have sent email to .. to confirm the validity of your email address. After receiving the email follow the link provided complete your registration </p>
            <p class="otc_sub_text_02">Once you confirm your email, your account will be activated</p>
            </div>
            <div class="otc_line"></div>
            <p class="otc_ask_for_resent">If you have not get any mail from us</p>
            <div class="block_for_timer"></div>
            <div class="otc_block_for_btn">
               <button class="otc_btn" id="otcResendEmail">Resend Email</button>
            </div>
        </div>`
        
            const resentBtn = document.getElementById('otcResendEmail')
            if(!resentBtn){
                return console.log(`Page not fully loaded`)
            }
            const resBtnBaseText = resentBtn.innerText
            resentBtn.addEventListener('click', ()=>{
                const blockTimer = document.querySelector('.block_for_timer')
                let timer = 30
                resentBtn.disabled = true
                resentBtn.style.opacity = 0.5
                const counting = setInterval(()=>{
                    timer--
                    blockTimer.innerHTML=`
                    <p class="timer">You can reset your email in ${timer}</p>`
                    if(timer<=0){
                        clearInterval(counting)
                        resentBtn.disabled = false
                        resentBtn.style.opacity = 1
                        const timerHtml = document.querySelector('.timer')
                        timerHtml.remove()
                    }
                 }, 1000)
            })
        
        return
    }
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
            this.offerToConfirmEmail();
                // loginAnswer.innerHTML=`<h1 class="answer_text">You have successfully registered</h1>`
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