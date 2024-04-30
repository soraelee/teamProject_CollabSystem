const authDAO=require("../dao/auth_dao")
const bcrypt = require("bcrypt");

const authProcess={
    loginCheck : async(body) => {
        console.log("serAuth")
        let idCheck = await authDAO.authProcess.loginCheck( body.userId , body.userPw , body.position);
       console.log("DB연결")
        idCheck=idCheck.rows[0];

        console.log("idCheck",idCheck)
        let msg="",url="",authResult={};
        try {
            if(idCheck === undefined){
                msg="로그인정보가 틀렸습니다."
                url="/auth/loginForm";
                authResult.result=0;
            }else{  //login successful
                
                    
                    authResult.result=1;
                    authResult.name=idCheck.USER_NAME;
                    authResult.position=idCheck.POSITION;
                    authResult.team=idCheck.TEAM;
                    authResult.userId=idCheck.USER_ID;
                    //||bcrypt.compareSync(body.pwd,idCheck.PWD)
                    msg=`${authResult.name}님 환영합니다.`
                    url="/main"
    
            }
        } catch (error) {
            console.log("login Error:",error)
        }
        

        authResult.msg=getMessage(msg,url);
        return authResult;
     },

    registerCheck : async(body) =>{
        
        let registerCheck = await authDAO.authProcess.registerCheck(body);    // body.userId , body.userPw , body.userName,body.position
        console.log("registerCheck:"+registerCheck);
        let registerResult={};

        if(registerCheck==1){ //success
            msg="회원가입을 축하드립니다. 로그인 해주시기 바랍니다"
            url="/auth/loginForm";
            registerResult.result=1;

        }else{
            msg="회원가입 오류 다시 입력해주시기바랍니다."
            url="/auth/registerForm";   
            registerResult.result=0;
        }

        registerResult.msg=getMessage(msg,url);
        return registerResult ;
    },
    idCheck:async (body)=>{
        let idCheck = await authDAO.authProcess.idCheck(body);
        return idCheck;
       
    },
    nameCheck:async (body)=>{
        let nameCheck = await authDAO.authProcess.nameCheck(body);
        return nameCheck;
       
    }
}
const  getMessage = (msg, url) =>{
    return `<script>alert('${msg}'); location.href="${url}";</script>`;
}


module.exports={authProcess};