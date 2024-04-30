const con =require("../../../config/database/db_connection")
const boardRead={
    data : async(num)=>{
        console.log("daoBD",num)
        const sql =`select * from board where write_no=${num}`;
        const data=await(await con).execute(sql);
        console.log("BDdao",data)
        //data는 promise로 오기 때문에 만약 data를 data함수 안에서 사용하기 위해서는
        //위 값에 대해 await을 한번 더 해줘야 된다.
        return data;
    },
    list :async (start,end)=>{
        // const sql ="select * from board";
        // const sql = `select * from (select rownum rn, A.* from 
        //     (select * from board order by write_no desc)A)
        //     where rn between ${start} and ${end}`;
        const sql = `select * from (select rownum rn, A.* from 
            (select * from board order by write_no desc)A)
            `;
        const list =(await con).execute(sql);
        //con을 직접 받을 때 await을 통해 con을 우선 처리해야된다.
        //우선처리 필수
        return list
    },
    totalContent : async () => {
        const sql = "select count(*) from board";
        const totalContent = await (await con).execute( sql );
        return  totalContent.rows[0]['COUNT(*)'];
    } ,
    writeform :async(id)=>{
        
        console.log("dao:",id)
        const sql = `select * from user_accounts where USER_NAME='${id}'`;
        console.log(sql)
        const userData = await (await con).execute( sql );
        console.log("userData:",userData)
        return userData;
    },
    modify_form:async(num)=>{
        const sql = `select * from board where WRITE_NO='${num}'`;
        const userData = await (await con).execute( sql );
        console.log("userData:",userData)
        return userData;
    },
    reply_List: async(writeNo)=>{
        const sql=`select * from reply_list where write_group='${writeNo}' ORDER BY save_date DESC`;
        const replyData = await (await con).execute( sql );
        console.log("replyData:",replyData)
        return replyData;
    }
}
boardUpdate={
    modify : async ( body )=>{
        let sql="";
       
        if(body.origin_file_name==undefined){
            console.log("파일을 찾을 수 없습니다.")
            // sql = `update board set title=:title, content=:content 
            // WHERE writeNo = :writeNo`;
            sql = `update board set title='${body.title}', content='${body.content}' ,attach_file_list=${body.attach_file_list}
            WHERE write_No = '${body.writeNo}'`;
        }else{
            console.log("파일을 찾았습니다.")
            // sql = `update board set title=:title, content=:content, 
            // origin_file_name=:origin_file_name WHERE writeNo = :writeNo
            // `;
            sql = `update board set title='${body.title}', content='${body.content}', 
            origin_file_name='${body.origin_file_name}',attach_file_list=${body.attach_file_list} WHERE write_No = '${body.writeNo}'
            `;
        }
        //    return (await con).execute( sql, body );
        let result=0;
        try{
            // result=(await con).execute( sql, body );
            console.log("sql:",sql)
            result=(await con).execute( sql);
        }catch(err){
            console.log(err);
        }
        return result;
    },
    delete : async (writeNo)=>{
        console.log("delWriteNo:",writeNo)
        const sql = `delete from board where write_no=${writeNo}`;
        await(await con).execute(sql);
    },
    upHit :async(num)=>{
        const sql = `update board set hit=hit+1 where write_no=${num}`;
        (await con).execute(sql);
    },
}
// create table board(
//     write_no number(10) primary key,
//     title varchar2(100),
//     content varchar2(300),
//     save_date date default sysdate,
//     hit number(10) default 0,
//     origin_file_name varchar(100),
//     attach_file_list varchar(100),
//     id varchar(20) not null,
//     constraint fk_test foreign key(id) references user_accounts(USER_ID) on delete cascade
//     ); 
const boardProcess={
    reply_Write :async(body)=>{
        console.log("bodyREPLYWRITE:",body)
        const sql =`insert into reply_List(id,content,write_group,save_date) values(:id, :replyText,:write_group,SYSDATE)`
        const result =await(await con).execute(sql,body);
        return result;
    },
    write:async(writeData)=>{
       
        const count =await boardRead.totalContent();
        console.log(count)
        console.log("writeData:",writeData)
        let sql ="";
        if(count==0){
            sql =`insert into board(write_no,id,title,content,save_date,origin_file_name,
                attach_file_list) values(1, :id, :title,:content,SYSDATE,
                :origin_file_name, :attach_file_list)`;
        }else{
            sql =`insert into board(write_no,id,title,content,save_date,origin_file_name,
                attach_file_list) values((select max(write_no)from board)+1, :id, :title,:content,SYSDATE,
                :origin_file_name, :attach_file_list)`;
        }
        
        console.log("daoBody:",writeData)

            
        const result = await (await con).execute(sql,writeData);
        const sqlWn=`select max(WRITE_NO) from board`;
        const write_no = await (await con).execute(sqlWn);
        console.log("result :" , result);
        const resultWr={
            daoResult:result,
            num:write_no.rows[0]['MAX(WRITE_NO)']
        }
        return resultWr;
    }
}

module.exports={boardRead,boardUpdate,boardProcess}