const router = require("express").Router();
const ctrl = require("../controller/information_controller");

const multer = require('multer');
const upload = multer();

router.get("/", ctrl.views.information)
router.get("/organization", ctrl.views.organization);
router.get("/userInfo", ctrl.views.userInfoPage);
router.get("/loadModify/:userId", ctrl.process.modifyPage);
router.post("/modify/:userId",upload.none(), ctrl.process.handleModify);
router.post("/team_mdf", ctrl.process.teamModify);
router.post("/team_make", ctrl.process.teamMaker);
module.exports = router;