const router = require("express").Router();
const codeCtrl = require("../controller/board_code_ctrl")
const multer = require("multer")


const stg = multer.diskStorage({
    destination : (req, file, cb) => {
        console.log("req :" , req.body)
        console.log("file:",file)
        console.log("cb :", cb)
        cb(null, "./code_file")
    },
    filename : (req, file, cb) =>{
        cb(null,file.originalname);
    }
})


const upLoad= //multer({storage : stg});
multer({storage : stg});
//code_form에 team목록 출력
router.get("/code_form", codeCtrl.codeView.renderCodeForm);
//code목록 가져오는 랜딩
router.get("/code_title/:teamId", codeCtrl.prosess.getCodeList);
router.get("/add_code", codeCtrl.codeView.complexity);
//코드 추가 페이지
//router.post("/prosess", codeCtrl.prosess.proInt);
router.get("/boardDetail/:ID", codeCtrl.codeView.boardDetail);
//router.post("/modify", codeCtrl.prosess.modify);
//file_router
router.post("/upload", upLoad.single("FILE_NAME"), codeCtrl.file_prosess.upload);
router.get("/list", codeCtrl.codeView.list);
router.get("/download/:fileName", codeCtrl.file_prosess.download);
//delete 수정
router.get("/delete", codeCtrl.deleteM);
//commend
router.post("/codeBoard_comments", codeCtrl.commend_prosess.commendInput);
router.get("/getAllComments",codeCtrl.commend_prosess.getAllCo);
router.get("/read-file/:fileN", codeCtrl.file_prosess.readFile);
module.exports = router;