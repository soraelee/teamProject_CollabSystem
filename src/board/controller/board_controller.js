const service = require("../service/board_service")

const board_views={
    data : async(req,res)=>{
        const data =await service.boardRead.data(req.params.num);
        //글의 값을 받아오기 위한 함수
        if(req.params.num==undefined){
            res.send(`<script>
            alert=("세션이 만료되었습니다.");
            window.location.href="/auth/loginForm";</script>`);
        }else{
            try{
        if(!req.session.result){
        //     res.send(`<script>
        //     alert=("세션이 만료되었습니다.");
        //     window.location.href="/auth/loginForm";</script>`); 
        res.redirect("/auth/loginForm")
        }
        const userId=req.session.result.userId;
        //사용자와 데이터가 일치하는 지 로그인 사용자 유무
        // data,
        console.log("boardList:",data)
        res.render("data",{data,userId})

        }catch(err){
            console.log(err);
            res.redirect=("/auth/loginForm")
        }
        
    }
    },
    list :async (req,res)=>{
        const data =await service.boardRead.list(req.query.start);
        // console.log("list:",data.list)
        // console.log("start:",data.start)
        // console.log("total:",data.totalPage)
        res.render("list",{list :data.list,
            start:data.start,
        totalPage : data.totalPage});

    },
   write_form: async(req,res)=>{
    console.log("ctrlDT",req.params)
    const data = await service.boardRead.idCheck(req.params.userId);
    console.log("CTRLDT:",data)
    res.render("write_form",{data})

   },
   modify_form: async(req,res)=>{
    console.log("req.params:",req.params)
    const data = await service.boardRead.modify_form(req.params.writeNo);
    console.log("data:",data)
    res.render("modify_form",{data});
   },
   reply_form:async(req,res)=>{
    const name=req.session.result.name
    const writeNo=req.params.writeNo
    console.log("사용자 명:",name)
    res.render("reply_form",{name,writeNo});
   },
   reply_List :async(req,res)=>{
    const data = await service.boardRead.reply_List(req.params.writeNo);
    console.log(data);
    res.json(data);
   }
}
const path=require("path")
const board_process={
    reply_Write :async(req,res)=>{
        console.log("CTRL_bodyREPLYWRITE:",req.body)
        console.log("CTRL_bodyREPLY_WRITENO:",req.params.writeNo)
        const result= await service.boardProcess.reply_write(req.body);
        
        if (result.rowsAffected == 1) {
            console.log(result);
            res.json({ success: true, num: req.params.writeNo });
        } else {
            res.json({ success: false });
        }
    },
    modify : async(req,res)=>{
        console.log("모디파이CTRL접근 완료",req.body)
        const pageNum=req.body.writeNo;
        const result= await service.boardUpdate.modify(req.body,req.files);
        console.log("ctrlModi:",result)
        if (result.rowsAffected == 1) {
            console.log(result);
            res.json({ success: true, num:req.params.writeNo });
        } else {
            res.json({ success: false });
        }
    },
    write : async (req,res)=>{
        console.log("writeCTRL:",req.body)
        console.log("writeCTRLFile:",req.files)

        const result= await service.boardProcess.write(req.body,req.files);
        
        if (result.daoResult.rowsAffected == 1) {
            console.log(result);
            res.json({ success: true, num: result.num });
        } else {
            res.json({ success: false });
        }
    },
    givedata:(req,res)=>{
        const filename = req.params.filename;
    const options = {
        root: path.join(__dirname, '..','..','..', 'upload_file'), // 파일이 저장된 디렉토리 지정
        dotfiles: 'deny',  // 숨김 파일 접근 금지
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(filename, options, (err) => {
        if (err) {
            console.log(err);
            res.status(404).send("File not found!");
        } else {
            console.log('Sent:', filename);
        }
    });
    },
    delete : async(req,res)=>{
        // 데이터베이스에서 삭제 성공 시 file삭제
        //성공이 되야 if문을 통해 파일 삭제
        console.log("delCtrl:",req.params)
        console.log("delCtrlWN:",req.params.writeNo)
        const result= await service.boardUpdate.delete(req.params.writeNo);
        res.json(result)
       
    },
   
}

module.exports={board_views,board_process};