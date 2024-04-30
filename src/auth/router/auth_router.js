const router =require("express").Router();

const authCtrl =require("../controller/auth_controller");


router.get("/loginForm",authCtrl.authView.loginForm);
router.get("/registerForm",authCtrl.authView.registerForm);
router.post("/loginCheck",authCtrl.authProcess.loginCheck);
// router.post("/loginCheck",(req,res)=>{
//     res.send("안녕?")
// });

router.post("/registerCheck",authCtrl.authProcess.registerCheck);
router.post("/idCheck",authCtrl.authProcess.idCheck)
router.post("/nameCheck",authCtrl.authProcess.nameCheck)





module.exports=router;
