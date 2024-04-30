const con =require("../../../config/database/db_connection");



const contributionProcess = {
    byCodeLine: async()=>{

        let teams={};
        const sql1=`select  distinct team  from  user_accounts order by 1 asc`;
        teams=await(await con).execute(sql1);


        let performanceInfo = []; // Array to store performance information
        console.log("teams.rows:",teams.rows[0].TEAM);
        for (let i=0;i<teams.rows.length; i++) {
            console.log(teams.rows[i].TEAM)
            if(teams.rows[i].TEAM==null ){  // client 는 팀이null이기떄문에 , client 에대한 예외
                continue;
            }
            else{
            const sql2 = `SELECT PERFORMANCE.codeLine, PERFORMANCE.user_name, PERFORMANCE.team FROM PERFORMANCE JOIN user_accounts
                ON PERFORMANCE.user_id = user_accounts.user_id WHERE PERFORMANCE.team = '${teams.rows[i].TEAM}'`;
            console.log(`sql2[${i}]:`,sql2);
            const performanceData = await (await con).execute(sql2);
            performanceInfo.push(performanceData.rows);
             }
        }
    
        console.log("performanceInfo:", performanceInfo);

       
       
        return performanceInfo;
    },
    MVP123: async() =>{
        
        let MVPInfo=[];
        const sql1=`select user_name,UPVOTE-DOWNVOTE as vote, codeLine  from PERFORMANCE order by UPVOTE-DOWNVOTE desc, CODELINE desc,UPVOTE desc `;
        MVPInfo=await(await con).execute(sql1);
        console.table(MVPInfo.rows);
        console.log("MVPInfo:"+MVPInfo.rows[0].USER_NAME);
        
        return MVPInfo.rows;

    }

}

module.exports={contributionProcess};