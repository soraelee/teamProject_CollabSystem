const service = require("../service/auth_service")
const fs = require('fs');
const path = require('path');
const { escape } = require("querystring");

const authView = {

    loginForm: (req, res) => {
        // console.log("sessionCheck확인:",sessionCheck)
        try{
        if(req.session.result.name!=undefined){
            res.render("mainView");
        }else{
            res.render("loginForm");
        }
    }catch(err){res.render("loginForm");}
    },
    registerForm: (req, res) => {
        res.render("registerForm");
    }

};

const authProcess = {

    loginCheck: async (req, res) => {  //

       
        console.log(req.body)
        const loginCheckresult = await service.authProcess.loginCheck(req.body);
        console.log("ctrlSESSION:",loginCheckresult);
        console.log(loginCheckresult);
        if (loginCheckresult === undefined) {
            // 로그인 검증 실패 처리
            return res.status(401).send("Login failed. Check credentials.");
        }
        if(loginCheckresult!=undefined){
        // if (req.session == null) { //in case of req.session.result is not existing 
            req.session.regenerate(async(err) => { //,by regenerating ,  cleans req.session right before login

                if (err) {
                    console.error("Error regenerating session:", err);
                    res.redirect("/auth/loginForm")
                    return;
                }
                // req.session.isAuthenticated = true;
                console.log("logincheckIP조회")
                req.session.result = loginCheckresult;
                //세션 조회를 위한 ip저장
                req.session.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                console.log("New session generated:", req.session.result);
                sessionCheck=req.session.result;
                await proceedWithLogin(loginCheckresult,req,res);
            });



        // } else {
        //     // If names are the same, proceed directly
        //     await proceedWithLogin(loginCheckresult,req,res);
        // }
        }else{
            alert("로그인에 실패하였습니다.")
            res.redirect("/auth/loginForm")
        }
   
        async function proceedWithLogin(loginCheckresult,req,res) {
            
            const newName = loginCheckresult.name;
            const currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            try {
                const files = await fs.promises.readdir(sessionDirectory);
                let sessionUpdated = false;

                for (let file of files) {
                    const filePath = path.join(sessionDirectory, file);
                    console.log("filePath",filePath);
                    const data = await fs.promises.readFile(filePath, 'utf8');
                    const sessionData = JSON.parse(data);
                    console.log(sessionData.ip)
                    console.log(newName)
                   
                    if(sessionData.result==undefined){
                        
                    }
                    else{
                    if (sessionData.result.name == newName && sessionData.ip != currentIp) {
                        console.log("세션IP",sessionData.ip,"접속IP",currentIp)
                        console.log("세션 확인 완료")
                        // 일치하는 세션 데이터 발견 시 세션 삭제 또는 업데이트 처리
                        await fs.promises.unlink(filePath); // 파일 삭제
                        sessionUpdated = true;
                    }
                }
                  
                }

                if (loginCheckresult.result === 1) { // Success
                    loginCheckresult.status = "online";
                    req.session.result = loginCheckresult;
                    res.locals.info = req.session.result;
                    console.log("req.session.result:", req.session.result);
                    await req.session.save(err => {
                        if (err) {
                            console.error('Error saving session:', err);
                            return res.redirect("/auth/loginForm");
                        }
                        // res.render("mainView", { session: req.session.result });
                        res.redirect("/mainView")
                    });
                } else {
                    // res.send(loginCheckresult.msg);
                    res.send("<script>alert('로그인 정보가 일치하지 않습니다.'); location.href='/auth/loginForm';</script>");
                    // res.render("loginForm")
                }

            } catch (error) {
                console.error('Error processing session files:', error);
                // res.redirect("/auth/loginForm")
            }
        }
    }, //loginCheck ends
    registerCheck: async (req, res) => {

        const registerCheckResult = await service.authProcess.registerCheck(req.body);
        if(registerCheckResult.result==1){
            res.send(registerCheckResult.msg)
        }else{
            res.send(registerCheckResult.msg)
        }

        res.send(registerCheckResult.msg)
    },
    idCheck : async(req,res)=>{
        console.log("idctrl동작")
        const idCheckResult = await service.authProcess.idCheck(req.body);
        console.log("idctrl반환")
        res.json(idCheckResult)
    },
    nameCheck : async(req,res)=>{
        console.log("idctrl동작")
        const idCheckResult = await service.authProcess.nameCheck(req.body);
        console.log("idctrl반환")
        res.json(idCheckResult)
    }


}





module.exports = { authView, authProcess };