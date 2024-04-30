const con = require("../../../config/database/db_connection")

const readViews = {
    calRead : async (user_id) => {
        const sql = `select * from calendar where private='off' OR user_id='${user_id}'`;
        const result = (await con).execute(sql);
        return result;  
    },
    teamGetter : async (teamName) => {
        const sql = `select * from calendar where team='${teamName}' and private='off'`
        const result = (await con).execute(sql);
        return result
    },
    infoRead : async () => {
        const sql = "select * from user_accounts";
        const result = (await con).execute(sql);
        return result;  
    },
    privateRead : async (user_id) => {
        const sql = `select * from calendar where private='on' and user_id='${user_id}'`;
        const result = (await con).execute(sql);
        return result;  
    },
}
const writeInsert = {
    addSchedule : async (body, user_id) => {

        const sql = `insert into calendar (title, startdate, enddate, color, team, user_id, private)
                    select '${body.title}', '${body.start}', '${body.end}', '${body.color}', ua.team, ua.user_id, '${body.private}'
                    from user_accounts ua
                    where user_id='${user_id}'`

        let result = 0;
        try{
            result =await(await con).execute(sql)
        }catch(err) {
            console.log(err)
        }
        
        return result;
    }
}
const writeDelete = {
    deleteSchedule : async (body) => {
        const sql = `delete from calendar where cal_id='${body.id}'`;
        let result = 0;
        
        try{
            result = await (await con).execute(sql)
        } catch(err) {
            console.log(err)
        }

        return result
    }
}
const writeModify = {
    dragModify : async (body) => {
        let sql = '';
        if(body[0].end === ''){
            sql = `update calendar set title='${body[1].title}', startdate='${body[1].start}', private='${body[1].private}'
                            where cal_id='${body[0].id}'`
            
        }else {
            sql = `update calendar set title= '${body[1].title}', startdate='${body[1].start}', enddate='${body[1].end}'
                            , color='${body[1].color}'
                          where cal_id='${body[0].id}'`
        }
        let result = 0;
        try{
            result = await (await con).execute(sql)
        }catch(err){
            console.log(err)
        }
        return result;
    },
    modifySchedule  : async (body) => {
       let sql = ''
       if(body[0].end === ''){
        sql = `update calendar set title='${body[1].title}', startdate='${body[1].start}', color='${body[1].color}' , private='${body[1].private}'
                            where cal_id='${body[0].id}'`
        
        }else {
            sql = `update calendar set title= '${body[1].title}', startdate='${body[1].start}', enddate='${body[1].end}'
                            , color='${body[1].color}', private='${body[1].private}'
                            where cal_id='${body[0].id}'`
        }
        let result = 0;
        try{
            result = await (await con).execute(sql)
        }catch(err) {
            console.log(err)
        }
        
        return result;
    }
}

module.exports = {readViews, writeInsert, writeDelete, writeModify}