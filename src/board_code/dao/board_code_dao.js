const oracleDB = require("oracledb")
const dbConfig = require("../../../config/database/db_config");
// const { response } = require("express");
// const { raw } = require("body-parser");

const conForAdd =require("../../../config/database/db_connection");




oracleDB.outFormat = oracleDB.OBJECT;
oracleDB.autoCommit = true;


const cdao = {

    listCo : async() =>{ //team code list
        let con = await oracleDB.getConnection(dbConfig)
        
        let result = await con.execute("select * from code_board order by TEAM asc, CODE_LINE asc")
        console.log("result1111111111:", result);
        con.close();
        return result.rows;
    },


    getComp : async() => { //Tema list
        let con = await oracleDB.getConnection( dbConfig );
        console.log("con :", con);
        let result = await con.execute("select distinct team from user_accounts order by TEAM asc")
        console.log("result :", result);
        return result.rows;
    },

    getCodeList : async (teamId) => {//CodeList
        console.log("team:",teamId)
        let con = await oracleDB.getConnection( dbConfig );
        let sql = `select id, code_line, title, file_name
            from code_board
            where Team = '${teamId}'
            `
        let result = await con.execute(sql)
        console.log("dao getCodeList", result)
        return result;
    },
    
    insert: async (req) => {
        try {
            console.log("helloo:", req.body);
            const sql = `
                INSERT INTO code_board (id, user_id, code_line, team, title, content, file_name) 
                VALUES (code_board_seq.nextval, '${req.body.USER_ID}', ${req.body.LINE_COUNT}, '${req.body.TEAM}', '${req.body.TITLE}', 
                '${req.body.CONTENT}', '${req.file.originalname}')`;
            console.log("sql:", sql);
           
            
            let result = await(await conForAdd).execute(sql);
            console.log("insert dao result:", result);
            
            return result;
        } catch (error) {
            console.error("Error executing SQL query:", error);
            throw error;
        } 
    }
    
}


const comment = async(req) =>{
    let con = await oracleDB.getConnection(dbConfig)
    
    const sql = `INSERT INTO code_comment (id, user_id, team, commentcontent, motherarticle) 
                  VALUES (code_comment_seq.nextval, '${req.user_id}', '${req.team}', '${req.commentContent}',
                   '${req.motherArticle}')`;

    console.log("sql ::::",sql)   ;          
    let result =  await con.execute(sql);
   
    return result;
}


const getAllCo=async() =>{
    let con = await oracleDB.getConnection(dbConfig)

    const sql = `select * from code_comment`;


    let result =  await con.execute(sql);

    return result;
}

//modify
const getPro = async (body) =>{
    let connection;
    try {
        connection = await oracleDB.getConnection(dbConfig);
        const sql = `select * from code_board where id=${body}`
       

        const result = await connection.execute(sql);
        console.log("DAO modify:", result);
        return result.rows;
    } catch (err) {
        console.error("DAO 확인:", err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

//수정 저장
const modify = async (body) =>{
    let con = await oracleDB.getConnection( dbConfig );
    const sql = `update code_board set user_id='${body.UWER_ID}',
                                        team='${body.TEAM}'
                                        title='${body.TITLE}'
                                        content='${body.CONTENT}'
                                        where cimplexity='${body.FILE_NAME}'`
    let result = 0;
    try{
        result = await con.execute(sql)
    }catch(err){
        console.log(err)
    }
    console.log("sql:", sql)
    return result;
}

const deleteM = async(body) =>{
    console.log("dao deletM : ", body)
    const sql = `delete from loginList where projectname=:PROJECTNAME`;
    const con = await oracleDB.getConnection( dbConfig )
    let result = 0;
    try{
        result = await con.execute(sql, body);
    }catch(err){
        console.log(err)
    }
    return result;
}

const boardInsert = {
    write : async (body) =>{
        const sql = `insert into board(write_no, id, title, content, 
            origin_file_name,change_file_name) values(board_seq.nextval,
            :id, :title, :content, :origin_file_name, :change_file_name)`;
        const result =await (await con).execute(sql, body);
        console.log("result :" , result)
        return result;
    }
    }



module.exports = { cdao, deleteM, getPro, modify ,comment,getAllCo}