module.exports=(app,io,socketIo)=>{
   
    const router =require("express").Router();
   
    app.getSocketIo = function() {
        return {
            socketIo: socketIo,
            io: io
        };
    };
    


    router.get("/",(req,res)=>{
        res.render("welcomePage.ejs")
    })

   
    const authRouter=require("../../src/auth/router/auth_router");
    app.use("/auth",authRouter);

    const boardRouter=require("../../src/board/router/board_router");
    app.use("/board",boardRouter);

    const calendarRouter=require("../../src/calendar/router/calendar_router");
    app.use("/calendar",calendarRouter);

    const contributionRouter=require("../../src/contribution/router/contribution_router");
    app.use("/contribution",contributionRouter);

    const informationRouter=require("../../src/information/router/information_router");
    app.use("/information",informationRouter)

    const boardCodeRouter=require("../../src/board_code/router/board_code_router");
    app.use("/board_code",boardCodeRouter)

    const mainController = require("../controller/main_controller")(app);
    // router.get("/update-status/:status",mainController.mainAjax.updateStatus);
    router.post("/update-status/",mainController.mainAjax.updateStatus);
    router.get("/logout",mainController.process.logout);
    router.get("/mainView",(req,res)=>{
        if (req.session.result) {
            // 세션 데이터가 존재한다면, 이를 사용하여 무언가를 처리
            res.render('mainView', { session: req.session.result });
        } else {
            // 세션 데이터가 없다면, 에러 페이지나 로그인 페이지로 리다이렉트
            res.redirect('/auth/loginForm');
        }
    })

    //세션 실시간
    router.get("/ForSessions",mainController.mainAjax.fetchGlobalSession); //
    // router.get("/check_session",mainController.mainAjax.check_session)
    router.get("/userInfo",(req,res)=>{
        res.send("유저정보")
    })
    router.get("/checkSession",(req,res)=>{
        let flag=0;
        if(!req.session.result){
            flag=1;
        }
        res.json(flag)
    })


    // //채팅 보내기
    // router.post("/setmessages",mainController.messages.setter)
    // //채팅 받기
    // router.get("/getmessages",mainController.messages.getter)

    return router;
}