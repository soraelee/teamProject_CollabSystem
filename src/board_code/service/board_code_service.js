const codeDAO = require("../dao/board_code_dao")


const codeRead = {
    eachTCode : async ()=>{
		const result = await codeDAO.cdao.eachTCode();
		//console.log("eachT ::" , result);
		return result;
    },

    getComp : async () =>{  //code_form team출력
        const result = await codeDAO.cdao.getComp();
        //console.log("service :", result);
        return result;
    },

    listCo: async () => { // 팀 코드 목록
        try {
            const teamCodes = await codeDAO.cdao.listCo();
            //console.log("Team Codes:", teamCodes);
            return teamCodes;
        } catch (error) {
            //console.error("Error:", error);
            throw error;
        }
    },
    getAllComment:async() =>{
        try {
            const allComment=await codeDAO.getAllCo();
            return allComment;
        } catch (error) {
            throw error;
        }
    }
,

    getCodeList: async(teamId) => {
        const result = await codeDAO.cdao.getCodeList(teamId);
        //console.log("ser getCodeList", result.rows)
        return result.rows;
    },

    //수정p
    getPro: async (body) => {
        try {
            
            const result = await codeDAO.getPro(body);
            return result;
        } catch (err) {
            //console.error("확인", err);
        }
    },

    insert : async ( req ) =>{ //코드 추가 페이지 저장 확인
        //console.log("service body :", req )
        let result = await codeDAO.cdao.insert( req );
        let msg="", url="";
        console.log("result" , result)
        if(result == 0){
            msg = "insert 문제"
            url = "/board/add_code/";
        }else{
            msg = "저장 성공"
            url = "/board/code_form/"
        }
        let mPack = getMessage(msg, url);
        console.log("mPack",mPack);
        return mPack;
    },

    commendInput : async(body) =>{
        console.log("ctrl 확인", body)
        const result = await codeDAO.comment(body);
       
        return result;
    },

    inFile : async(body) =>{
        //console.log("serv::",body)
        const result = await codeDAO.cdao.inFile(body)
        let msg ="", url="";
        //console.log("inFile result",result)
        if(result == 0){
            msg = "inFile 문제"
            url = "/board/add_code/";
        }else{
            msg = "저장 성공"
            url = "/board/code_form/"
        }
        let mPack = getMessage(msg, url);
        return mPack;
    }
}

const deleteM = async (body) =>{
    //console.log ( body )
    const result = await codeDAO.deleteM( body );
    let msg = "", url = "";
    if(result == 0 ){
        msg = "문제 발생.."
        url = `/board/code_form/${body.projectname}`;
    }else{
        msg = "삭제"
        url = "/board/code_form/"
    }
    //console.log("msg :::", msg)
    //console.log("url :::", url)
    return getMessage(msg, url)
}

//수정 저장
const modify= async (body) =>{
    //console.log("modify >>", body)
    let msg ="", url="";
    let result = await codeDAO.modify(body)
    if(result == 0){
        msg = "문제 발생"
        url = `/board/modify_form?PROJCETNAME=${body}`
    }else{
        msg = "수정 완료"
        url = `/board/code_form/`
    }
    return getMessage(msg, url)
}

const getMessage = (msg, url) =>{
    return `<script> alert("${msg}");
    location.href="${url}"; </script>`
}


const common = require("../service/file_common")
const cFile ={
    write : async (body, file, fileValidation) =>{
        let msg, url;
        if(fileValidation){
            msg = fileValidation
            url = "/board/add_code";
            return common.getMessage(msg, url)
        }
        console.log("file :", file)
        if(file != undefined){
            body.origin_file_name = file.originalname;
            body.change_file_name = file.filename;
        }else{body.origin_file_name = "non"
        body.change_file_name = "non"
    }
    console.log("body :", body)
    const result = await dao.boardInsert.write( body )
    if( result.rowsAffected === 1){
        msg = "등록되었습니다"
        url = "/board/list";
    }else{
        msg = "저장 실패"
        url = "/board/write_form"
    }
    return common.getMessage(msg, url)
    }
}




module.exports = { codeRead, deleteM, modify, cFile };