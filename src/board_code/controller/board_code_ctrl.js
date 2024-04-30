const oracleDB = require("oracledb");
const dbConfig = require("../../../config/database/db_config")
const codeSer = require("../service/board_code_service");

oracleDB.autoCommit = true;
oracleDB.outFormat = oracleDB.OBJECT;


const fs = require("fs");
const path = require("path");
const { getAllCo } = require("../dao/board_code_dao");

const codeView = {
    // show_board : async (req,res) =>{
    //     console.log("show_board",req.params.TEAM);
    //     res.render("code_form",{show_board})
    // },
    
    // show_code : async (req, res) =>{
    //     console.log("show_code", req.params.CODE_LINE);
    //     res.render("code_form", {show_code})
    // },

    // 팀 코드 목록code_form 목록 출력
    
    renderCodeForm: async (req, res) => { 
        const pTeamName = await codeSer.codeRead.getComp();
        // console.log(">>>>33",pTeamName)
        const pCodeLine = await codeSer.codeRead.listCo();
        // console.log(">>>>>>>>>",pCodeLine)
        res.render("code_form", { pTeamName, pCodeLine });
    },


    // add_form
    complexity : async (req, res) =>{  
        const complexity = await codeSer.codeRead.getComp();
        // console.log("complexity :", complexity);
        res.render("add_code", {complexity} );

    },

    
    boardDetail : async (req, res)=>{  
       console.log("req.params:",req.params);
        let modyB = await codeSer.codeRead.getPro(req.params.ID);
        console.log("modyB:::",modyB);
        res.render("boardDetail", {modyB});
        
    },

    list : (req, res) =>{
        let fList;
        fList = fs.readdirSync("./code_file") //프로젝트 안의 파일명
        //console.log(fList)
        res.render("modify_form", { list : fList})
    },
};

const deleteM = async (req, res) =>{  
    let msg = await codeSer.deleteM(req.params);
    //console.log( msg )
    res.send( msg );
}



const prosess ={
    //내용추가
    proInt : async (req, res) =>{ 
        let msg = await codeSer.codeRead.insert(req.body);
       
        res.send( msg );
    },

    //수정저장
    modify : async (req, res) =>{ 
        //console.log("ctrl body =>>", req.body)
        let msg = await codeSer.modify(req.body)
        res.send( msg )
    },
    
    getCodeList : async (req, res) =>{  //code_form에 title출력
        //console.log("ctrl params =>>", req.params.teamId)
        let result = await codeSer.codeRead.getCodeList(req.params.teamId)
        //console.log("result::::::::;",result)
        let responseData = {
            teamId: req.params.teamId,
            result: result
        };
        res.json(responseData);
    },
}

const commend_prosess = {
    //답글 정보 추가 
    commendInput : async (req, res) =>{
        console.log("req.body", req.body)
        const result = await codeSer.codeRead.commendInput(req.body);
        // console.log("result",result);

        const allComment= await codeSer.codeRead.getAllComment();
        console.log("allComment:",allComment);
        res.json(allComment.rows);
    },
    getAllCo:async(req,res)=>{
        const allComment= await codeSer.codeRead.getAllComment();
        console.log("allComment:",allComment);
        res.json(allComment.rows);
    }

}


//코드 파일 화면출력
const file_prosess ={
       //업로드파일
       upload : async (req, res) =>{ 
        console.log("업로드 진입 :");
        if(req.fileValidation){
            return res.json(0)
            // send(req.fileValidation)
        }
        let msg = await codeSer.codeRead.insert(req);

        console.log("msg 확인 :",msg);
        res.json(1);

    },

    download : (req, res) =>{
        //console.log("파일이름:",req.params.fileName)
        const path = `./code_file/${req.params.fileName}`
        //console.log(path)
        res.download(path);
    },

    readFile : (req, res)=>{
        const filePath = './code_file/${fileN}';
        fs.readFile(filePath, {encoding: 'utf-8'},(err, data)=>{
            if(err){
                console.log("errrr", err)
                res.status(500).send('File read error');
                return
            }
            res.send(data);
        })
    }

}


module.exports = {codeView , prosess, deleteM, file_prosess, commend_prosess };