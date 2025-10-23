/*setTimeout(
    ()=>{
        console.log("hello world")
    },1000
)*/
//input run after givenn time in miliseconds
 
//create promise
const isNetworkOkay=true;// artificially input
const promiseOne=new Promise(
    (resolve,reject)=>{
        setTimeout(
            ()=>{
                if(isNetworkOkay){
          //success
          console.log("data saved in database")
             resolve()
                }else{
                    console.log("data not saved in database")
          //unsucsess
            reject()    }
            },5000
        )
    }
)
promiseOne.then(
    ()=>{
        console.log("upload complete")
    }
).catch(
    ()=>{
        console.log("upload failed")
    }
)