const con =require("../../config/database/db_connection")

//메세지 임시 테이블 생성
// create table chattingTable(
//     indexChat number(20) PRIMARY KEY,
//     id varchar(20),
//     content varchar(300),
//     pdate varchar2(10) not null,
//     TEAM varchar2(10)
//     );
const view={
  list :async()=>{
    const sql="select * from user_accounts"
    const result =await(await con).execute(sql);
    return result.rows;
  }
}
const messages={
    setter:async(text)=>{
      console.log("textdao:",text.TEAM)
      console.log("textdao userName:",text.userName)
        const sql1="select * from chattingTable"
        const result1 =await(await con).execute(sql1);
        let sql=""
        if(result1.rows.length === 0){
         sql=`INSERT INTO chattingTable(indexChat, id, content,pdate,team)
            VALUES  ('1' ,'${text.userName}','${text.text}',sysdate,'${text.team}')
            `; 
        }else{
         sql=`INSERT INTO chattingTable(indexChat, id, content,pdate,team)
        VALUES  ((select max(indexChat) from chattingTable)+1 ,'${text.ID}','${text.CONTENT}',sysdate,'${text.TEAM}')
        `;
        }
        const result =await(await con).execute(sql);
        return result.rowsAffected;
        
    },
    getter:async()=>{
      const sql="select * from chattingTable order by indexChat asc"
      const result =await(await con).execute(sql);
      // console.log("daoGetMsg",result.rows)
      return result.rows;
    },
  }

module.exports={messages,view}