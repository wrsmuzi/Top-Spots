
 class functionsHandler {

    statusController = (status)=>{
        if(!status){
            console.log(`Status controller have not status receive`)
            return
        }
        switch(status) {
            case 200:
                console.log(`User is logged in YEAAAAAAAAAH`)
                break
            case 400:
                break
            case 401:
                break
            case 404:
                break
            case 429:
                 break
            default:
                break

        }
    }



    sendLogIn = async (obj)=>{
        try{
            const sendingData = await fetch('http://localhost:3500/api/logIn',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            this.statusController(sendingData.status)
          
        }catch(err){
            console.log(`Internal sevrver error`)
            throw new Error(`Problem with server: ${err.statusText}`)
        }
    }
}

export default functionsHandler;