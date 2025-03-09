//----------------  Class with functions for auth_fr.js --> authentication.html  -----------------------------------------
 class authFunctionsHandler {

    resentEmail = async (email) =>{
        const obj = {
            email
        };
        try{
            const sentEmail = await fetch('http://localhost:3000/resent-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
        }catch(err){
            console.log(`Internal sevrver error`)
            throw new Error(`Problem with server: ${err.statusText}`)
        }
    }

    
    loadingRegAnimation = () =>{
        const regBlock = document.getElementById('registratioBlock')
        const loadingBlock = document.querySelector('.block_for_all_loading_animation')
        regBlock.classList.remove('validRegLogForm') 
        regBlock.classList.add('invalidRegLogForm') 
        loadingBlock.classList.remove('inactive_loading_block')
        loadingBlock.classList.add('active_loading_block')
    }
    loadingLogAnimation = () =>{
        const logBlock = document.getElementById('loginBlock')
        const loadingBlock = document.querySelector('.block_for_all_loading_animation')
        logBlock.classList.remove('validRegLogForm') 
        logBlock.classList.add('invalidRegLogForm') 
        loadingBlock.classList.remove('inactive_loading_block')
        loadingBlock.classList.add('active_loading_block')
         
    }
     //--------------------- Function about Offer to Confirm Email -----------------------------------------------------
     offerToConfirmEmail = async (createdEmail)=>{
        const mainBlockForAll = document.querySelector('.main_block_for_all')
        const loadingBlock = document.getElementById('loadingBlock')
        loadingBlock.classList.add('invalidRegForm')
        mainBlockForAll.innerHTML=`
           <div class="offerToConfirm_main_block">
             <div class="offerToConfirm_sub_block">
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
               <p class="otc_sub_text">We have sent email to <span class="otc_email_text">${createdEmail}</span> to confirm the validity of your email address. After receiving the email follow the link provided complete your registration </p>
               <p class="otc_sub_text_02">Once you confirm your email, your account will be activated</p>
             </div>
             <div class="block_for_line">
               <div class="otc_line"></div>
             </div>
             <p class="otc_ask_for_resent">If you haven't received any emails from us</p>
             <div class="block_for_timer"></div>
             <div class="otc_block_for_btn">
               <button class="otc_btn" id="otcResendEmail">Resend Email</button>
             </div>
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
                    <p class="timer">You can reset your email in ${timer}s</p>`
                    if(timer<=0){
                        clearInterval(counting)
                        resentBtn.disabled = false
                        resentBtn.style.opacity = 1
                        const timerHtml = document.querySelector('.timer')
                        timerHtml.remove()
                    }
                 }, 1000)
                 // here function sendemail
                  this.resentEmail(createdEmail)

            })
        
        return
    }
    //---------------------------Function for Creating Answer from Server in Registration form------------------------
    answerRegError = async (errorText) =>{
        const loadingBlock = document.getElementById('loadingBlock');
        const regBlock = document.getElementById('registratioBlock');
        const answerBlock = document.querySelector('.block_for_answer_reg');

        if (!loadingBlock || !regBlock || !answerBlock) {
            console.error("One of this element is not exist");
            return;
        }

        answerBlock.innerHTML = "";

        loadingBlock.classList.remove('active_loading_block');
        loadingBlock.classList.add('inactive_loading_block');
        regBlock.classList.remove('invalidRegLogForm');
        regBlock.classList.add('validRegLogForm');

        answerBlock.innerHTML = errorText;
    }
    //---------------------------Function for Creating Answer from Server in Login form------------------------
    answerLogError = async (errorText) =>{
        const loadingBlock = document.getElementById('loadingBlock');
        const loginBlock = document.getElementById('loginBlock');
        const answerBlock = document.querySelector('.block_for_answer_log');

        if (!loadingBlock || !loginBlock || !answerBlock) {
            console.error("One of this element is not exist");
            return;
        }

        answerBlock.innerHTML = "";

        loadingBlock.classList.remove('active_loading_block');
        loadingBlock.classList.add('inactive_loading_block');
        loginBlock.classList.remove('invalidRegLogForm');
        loginBlock.classList.add('validRegLogForm');

        answerBlock.innerHTML = errorText;
    }
    //---------------------- Function to control Log In answer of status code from back end -----------------------------
    statusLogInController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
    //---------Error Text HTML----------------------  
        const success200 = `<h1 class="answer_text">You have successfully logged in</h1>`
        const wrongLogOrErrError401 = `<h1 class="answer_text">Wrong login or password</h1>`
        const tooManyRequestsError429 = `<h1 class="answer_text">Too many requests, please try again later</h1>`
        const unknowProblemErrorDef = `<h1 class="answer_text">An error occurred, we are working on it</h1>`

        switch(status) {
            case 200: 
                this.answerLogError(success200);
                break;
            case 401:
                this.answerLogError(wrongLogOrErrError401);
                break;
            case 429:
                this.answerLogError(tooManyRequestsError429);
                 break;
            default:
                this.answerLogError(unknowProblemErrorDef);
                break;
        }
    }
    //---------------------- Function to control Sign Up answer of status code from back end ------------------------
    statusSignUpController = (status, createdEmail)=>{
        if(!status){
            return console.log(`Status controller have not status receive`)
        }
    //---------Error Text HTML----------------------  
        const correctnessError400 = `<h1 class="answer_text">Please check the correctness of the entered data</h1>`
        const existUserError409 = `<h1 class="answer_text">Registration failed, check your details</h1>`
        const tooManyRequestsError429 = `<h1 class="answer_text">Too many requests, please try again later</h1>`
        const unknowProblemErrorDef = `<h1 class="answer_text">An error occurred, we are working on it</h1>`
  
        switch(status) {
            case 201: 
                this.offerToConfirmEmail(createdEmail);
                break;
            case 400:
                this.answerRegError(correctnessError400);
                break;
            case 409:
                this.answerRegError(existUserError409);
                break;
            case 429:
                this.answerRegError(tooManyRequestsError429);
                break;
            default:
                this.answerRegError(unknowProblemErrorDef);
                break;
        }
    }
   
    //--------------------- Function for Log In -----------------------------------------------------
    sendLogIn = async (obj)=>{
        try{
            const sendingData = await fetch('http://localhost:3000/api/logIn',{
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
            const sendingData = await fetch('http://localhost:3000/api/signUp',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            const responseData = await sendingData.json();
            if(!responseData.createdEmail){
                return console.log(`No email arrived from the server`)
                    
            }
            this.statusSignUpController(sendingData.status, responseData.createdEmail)

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