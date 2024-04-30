const router = require("express").Router();
const boardCtrl =require("../controller/board_controller")
router.get("/",boardCtrl.board_views.list)
router.get("/data/:num",boardCtrl.board_views.data);
router.get('data', (req, res) => {
    const num = req.params.num;
    // 데이터를 조회하고 응답을 처리하는 로직
    res.send('Data for ' + num);
});
router.get("/write_form/:userId",boardCtrl.board_views.write_form)
// router.post("/write",boardCtrl.board_views.write)

//파일 업로드 구현
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('req:',req.body);
        console.log("file :",file)
        console.log("cb: ",cb)
        
      cb(null, 'upload_file/') // 업로드 디렉토리 설정
  },
  filename: function (req, file, cb) {
      cb(null, Date.now()+"-"+file.originalname) // 파일명 설정
  }
});
const f_filter=(req,file,cb)=>{
    console.log("f_filter file",file.mimetype.split("/"));
    const type=file.mimetype.split("/");
    if(type[0]=="image"){
        cb(null,true)
    }else{
        req.fileValidation="이미지만 저장하세요";
        cb(null,false)
    }
}


//const fileCtrl=require("../controller/file_controller")

const upload = multer({ storage: storage, fileFilter:f_filter });
router.post('/upload', upload.single('upload'), (req, res) => {
    if (req.fileValidation) {
        return res.status(400).json({ error: req.fileValidation });
    }
    const url = `${req.protocol}://${req.get('host')}/board/givedata/${req.file.filename}`;
    console.log(url)
    res.json({
        uploaded: true,
        url: url
    });
});
router.get('/givedata/:filename',boardCtrl.board_process.givedata)

const attach_file_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('req:',req.body);
          console.log("attach_file :",file)
          console.log("cb: ",cb)
          
        cb(null, 'attach_file/') // 업로드 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+"-"+file.originalname) // 파일명 설정
    }
  });
 
  

const write_multer=multer({storage:attach_file_storage});

router.post("/write",write_multer.array('image_file_name[]', 10),boardCtrl.board_process.write)
// router.post("/write",write_multer.none(),boardCtrl.board_process.write)
router.get("/delete/:writeNo",boardCtrl.board_process.delete);
router.get("/modify_form/:writeNo",boardCtrl.board_views.modify_form);
router.post("/modify/:writeNo",write_multer.array('image_file_name[]', 10),boardCtrl.board_process.modify)
router.get("/reply_form/:writeNo",boardCtrl.board_views.reply_form);
router.get("/reply_List/:writeNo",boardCtrl.board_views.reply_List);

const reply_Multer = require('multer');
const reply_Upload = multer()
router.post("/reply_write/:writeNo",reply_Upload.none(),boardCtrl.board_process.reply_Write);
module.exports=router;