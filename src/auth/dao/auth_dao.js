const con =require("../../../config/database/db_connection");


const authProcess={
    loginCheck : async (userId , userPw, position)=>{
        const sql = `SELECT * FROM user_accounts WHERE user_id='${userId}' AND user_pw='${userPw}' AND position='${position}'`;
        let idCheck_result=null;
    
        try{
            console.log("DB연결시작");
            idCheck_result = await(await con).execute(sql);
            console.log("DB연결끝")
            
        }catch(err){
            console.log( err );
        }
        return idCheck_result;
    },
    registerCheck : async(regInfo) =>{
        const userId=regInfo.userId;
        const userPw=regInfo.userPw;
        const userName=regInfo.userName;
        const position=regInfo.position;
        const sql=`INSERT INTO user_accounts (id, user_id, user_pw, user_name, position, team)
        VALUES  ( user_accounts_seq.nextval , '${userId}', '${userPw}', '${userName}', '${position}', NULL)
        `;
        console.log("sql:"+sql);
        let registerCheck_result=0;
        
        try {
            const result = await(await con).execute(sql);
            if (result.rowsAffected && result.rowsAffected > 0) {
                registerCheck_result=1;
                 // Success
            } else {
                registerCheck_result=0;
                // Failure
            }
        } catch (error) {
            console.log("Error in registerCheck:", error);
            registerCheck_result=0;

           ; // Failure
        }
        return registerCheck_result;
      
    },
    idCheck:async (body)=>{
        const sql = `SELECT * FROM user_accounts WHERE user_id='${body.userId}'`;
        let idCheck_result=null;
    
        try{
            idCheck_result = await(await con).execute(sql);
            
        }catch(err){
            console.log( err );
        }
        return idCheck_result;
    },
    nameCheck:async (body)=>{
        const sql = `SELECT * FROM user_accounts WHERE user_name='${body.name}'`;
        let idCheck_result=null;
    
        try{
            idCheck_result = await(await con).execute(sql);
            
        }catch(err){
            console.log( err );
        }
        return idCheck_result;
    }

}

module.exports={authProcess};