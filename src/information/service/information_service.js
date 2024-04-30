const dao = require("../dao/information_dao")

const viewInfo = {
    infoUser : async () => {
        const result = await dao.viewInfo.userInfo()
        console.log("ser : ", result.rows)
        return result.rows
    },
    teamGetter : async () => {
        const result = await dao.viewInfo.teamGetter()
        result.rows.forEach((dict) => { 
            const year = dict.MADE_DATE.getFullYear()
            let month = dict.MADE_DATE.getMonth() +1
            if(month < 10)
                month = '0' + month
            const day = dict.MADE_DATE.getDate()
            dict.MADE_DATE = year + '-' + month + '-' + day
        })

        return result.rows;
    }
}
const getOrganizationInfo = async () => {
        const result = await dao.viewInfo.userInfo();
        return result.rows;
};
const getCurrentUserInfo = async (userId) => {
    const result = await dao.viewInfo.userInfo();
    const currentUser = result.rows.find(user => user.USER_ID === userId);
    return currentUser;
};
const userInfoModify = async (userId, updatedUserInfo) => {
    const currentUserResult = await dao.viewInfo.userInfo();
    const currentUser = currentUserResult.rows.find(user => user.USER_ID === userId);

    if (updatedUserInfo.pw === currentUser.USER_PW && updatedUserInfo.name === currentUser.USER_NAME){
        return -1;
    }

    const result = await dao.infoModify(userId, updatedUserInfo);
    console.log("serResult", result)
    let msg="", url="";
    return result.rowsAffected;
}
const teamModify = async (body) => {
    console.log("ser teamModify", body)
    
    const results = await dao.teamModify(body);

    return results;
}

const  teamMaker = async(body) =>{
    let bodyTeam = []
    let bodyName = []
    let oldTeam = []
    body.forEach((e) => {
        bodyTeam.push(e.id)
        bodyName.push(e.team_name)
    })
    const uniqueNames = Array.from(new Set(bodyName));
    
    if(uniqueNames.length !== bodyTeam.length){
        return -1;
    }

    const teamGetter = await dao.viewInfo.teamGetter()
    if (teamGetter.rows.length !== 0){ //undefined가 아닌 경우 즉 기존 팀이 있는 경우
        
        teamGetter.rows.forEach(async(o) => {
                if(bodyTeam.indexOf(`${o.ID}`) == -1 ){ //body로 수정된 팀과 기존 팀을 비교했을 때 body팀 안에 기존 팀이 없을 경우 
                    oldTeam.push(o.ID)
                    const delR = await dao.teamDelete(o.ID) //삭제
                    console.log("delR", delR)
                }
            })
    }

    const results = await dao.teamMaker(body, oldTeam)
    return results;
}
const  getMessage = (msg, url) =>{
    return `<script>alert('${msg}'); location.href="${url}";</script>`;
}
module.exports = {viewInfo, getOrganizationInfo, getCurrentUserInfo, userInfoModify, getMessage, teamModify, teamMaker}