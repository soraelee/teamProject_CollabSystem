const dao =require("../dao/board_dao");
const fs = require('fs');
const path = require('path');
const boardRead={
    list :async(start)=>{
        const totalCounter=await dao.boardRead.totalContent();
        start=(start&&start>1)? Number(start) : 1;
        const page = pageOperation(start,totalCounter);
        let list =await dao.boardRead.list(page.startNum,page.endNum);

        // const list =await dao.boardRead.list();
        list=timeModify(list.rows);
        // let list =await dao.boardRead.list();
        // list =common.timeModify(list.rows);
        // return list;
        // return list.rows;
        data={}; data.totalPage=page.totPage;
        data.start=start; data.list=list;
        
        return data;
    },
    data : async(num)=>{
        boardUpdate.upHit(num);
        let data=await dao.boardRead.data(num);
        data=timeModify(data.rows);
        return data[0]
    },
    idCheck: async(id)=>{
        console.log("serID",id)
        let result=await dao.boardRead.writeform(id);
        return result.rows[0].USER_ID;
    },
    modify_form : async(writeNo)=>{
        let result=await dao.boardRead.modify_form(writeNo);
        return result.rows[0]; 
    },
    reply_List : async(writeNo)=>{
        let result=await dao.boardRead.reply_List(writeNo);
        return result.rows;
    }
}
const boardUpdate={
    modify :async (body,file)=>{
        
            let exist=await dao.boardRead.modify_form(body.writeNo);
            console.log("exist:",exist)
            const checkFileList=exist.rows[0].ORIGIN_FILE_NAME;
            const imageData=extractImageFilenames(body.content)
            const contentImg=arrayToString(imageData)
            const writeData={
            writeNo:body.writeNo,
            id:body.id,
            title:body.title,
            content:body.content,
            origin_file_name:contentImg
            }
        const result =await dao.boardUpdate.modify(writeData);
        //파일을 선택하지 않았다면 파일을 그대로 사용
        console.log("Body=>",body);
        // const result =await dao.boardUpdate.modify(body);
       
        
        return result;
    },
    delete : async(writeNo)=>{
        console.log("serboard:",writeNo)
        let data=await dao.boardRead.data(writeNo);
        try{
        if(data.rows[0].ORIGIN_FILE_NAME!="NULL"){
        let result=data.rows[0].ORIGIN_FILE_NAME;
        console.log("삭제할 파일 목록",result)
        delFile(result);
        const delResult=await dao.boardUpdate.delete(writeNo);
        console.log("delResult:",delResult)
        }else{
            const delResult=await dao.boardUpdate.delete(writeNo);
        }
        }catch(err){
            console.log("delDataErr",err)
        }
        return 1;
    },
    upHit:(num)=>{
        dao.boardUpdate.upHit(num);
    },
}
function delFile(fileList){
    if(fileList){
    const fileNames = fileList.split(',');
    fileNames.forEach(fileName => {
        const filePath = path.join(__dirname, '../../../upload_file', fileName);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${fileName}: ${err.message}`);
            } else {
                console.log(`${fileName} was deleted successfully.`);
            }
        });
    });
    }else{

    }

// 각 파일을 /upload_file 디렉토리에서 삭제합니다.

}
const timeModify=(list)=>{
    //우리가 가져온 시간 값을 변경하여 다시 보내주도록 한다
    list=list.map((data)=>{
        //map은 연산을 통해 리턴 값을 연산에 넣어준다.
        // 모든 데이터가 1줄 씩 들어왔을 때
        data.SAVE_DATE=data.SAVE_DATE.toLocaleString();
        //시간의 데이터를 돌려주면
        return data;
        //data위치로 그대로 들어간다.
    });
    return list;
    
}
const pageOperation = (start, totalCounter)=>{
    let page = {};
    const pageNum = 3; //페이지당 보여줄 개수
    const num = (totalCounter % pageNum === 0)?0:1;

    page.totPage = parseInt( totalCounter / pageNum ) + num;
    
    page.startNum = (start-1) * pageNum + 1;
    page.endNum = start * pageNum;
    return page;
}

const boardProcess={
    reply_write:async(body)=>{
        console.log("SER_bodyREPLYWRITE:",body)
        const result =await dao.boardProcess.reply_Write(body);
        return result;
    },
    write:async(body,files)=>{
        let attach_file_list = [];
    // forEach를 사용하여 모든 파일의 filename을 배열에 추가
    let contentImg="NOTDATA";
    let attachFile="NOTDATA";

    files.forEach(file => {
        attach_file_list.push(file.filename);
    });
        attachFile=arrayToString(attach_file_list)
        const imageData=extractImageFilenames(body.content)
        contentImg=arrayToString(imageData)
        const writeData={
            id:body.id,
            title:body.title,
            content:body.content,
            origin_file_name:contentImg,
            attach_file_list:attachFile
        }
        const result =await dao.boardProcess.write(writeData);
        return result;
    },

}
function extractImageFilenames(content) {
    const regex = /givedata\/([^"]+)/g;
    const matches = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]); // 파일 이름 부분만 추출
    }

    return matches;
}
function arrayToString(array) {
    // 배열의 요소를 쉼표로 구분하여 문자열로 변환
    if(array){
        return array.join(',');
    }else{
        return "NOTDATA"
    }
    
}



module.exports={boardRead,boardProcess,boardUpdate}