const con = require("../../../config/database/db_connection")

const viewInfo = {
    userInfo : async () => {
        const sql = "SELECT * FROM user_accounts";
        const result = (await con).execute(sql);
        return result;
    },
    getCurrentUserInfo : async (userId) => {
        const sql = 'SELECT user_id, user_name, position, team FROM user_accounts WHERE user_id = ?';
        const result = (await con).execute(sql, [userId]);
        return result[0][0];
    },
    teamGetter : async () => {
        const sql = 'select * from team_management order by team_name asc'
        const result = (await con).execute(sql);

        return result;
    }
};
const infoModify = async (id, body) => {
    console.log("dao", body)
    const sql = `UPDATE user_accounts SET user_pw= '${body.pw}', user_name= '${ body.name}', position= '${body.position}',
                team= '${body.team}' WHERE user_id= '${body.id}'`;
    let result;
    try{
        result = await (await con).execute(sql);
    }catch(err){
        console.log(err);
    }
    return result;
}
const teamModify = async (body) => {
    let results = 0;
    for (const bo of body) {
        const sql = `UPDATE user_accounts SET team = '${bo.team}' WHERE id = '${bo.user_id}'`;
        try {
            const result = await (await con).execute(sql);
            results += result.rowsAffected;
        } catch (err) {
            console.log(err);
        }
    }
    return results;
}
const teamMaker = async (body, oldTeam) => {
    let results = 0;
    
    for (const bo of body) {
        let sql = '';
        if(oldTeam.indexOf(bo.id) === -1){ //삭제된 팀의 내용에 id이 없을 경우 --해당 아이디가 삭제 X
            if(bo.id !== ''){  //새로운 팀에 id값이 없을 경우 --> 업데이트
                sql = `update team_management set team_name='${bo.team_name}' where id='${bo.id}'`
            }else { //삭제되지 않았고 새로운 팀에 아이디가 있다면 -- insert
                sql = `insert into team_management values(team_management_seq.nextval, '${bo.team_name}', '${bo.made_date}')`;
            }
        }
        try {
            const result = await (await con).execute(sql);
            results += result.rowsAffected;
        } catch (err) {
            console.log(err);
        }
    }
    return results;
}
const teamDelete = async (id) => {
    let result = 0;
    
    const sql = `delete from team_management where id=${id}`
    try {
        result = await (await con).execute(sql);
    } catch (err) {
        console.log(err);
    }
    return result;
}

module.exports = {viewInfo, infoModify, teamModify, teamMaker, teamDelete}