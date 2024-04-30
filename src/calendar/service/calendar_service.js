const dao = require("../dao/calendar_dao")

const readViews = {
    readCal : async (user_id) => {
        const result = await dao.readViews.calRead(user_id)
        
        return result.rows
    },
    teamGetter : async (team) => {
        let teamName = team.replace('_', ' ')
        const result = await dao.readViews.teamGetter(teamName)
        return result.rows
    },
    teamGroupMake : async () => {
        const result = await dao.readViews.infoRead()
        let group = []
        result.rows.forEach((dict) => {
            if (group.indexOf(dict.TEAM) == -1 && dict.TEAM !== null)
                group.push(dict.TEAM)
        })
        
        return group;
    },
    privateRead : async (user_id) => {
        const result = await dao.readViews.privateRead(user_id)
        return result.rows
    }
}

const writeInsert = {
    addSchedule : async (body, user_id) => {
        if(!('private' in body)){
            body.private = 'off'
        } 
        
        const result = await dao.writeInsert.addSchedule(body, user_id)
        return result.rowsAffected;
    },
    
}

const writeDelete = {
    deleteSchedule : async (body) => {
        const result = await dao.writeDelete.deleteSchedule(body)
        return result.rowsAffected;
    }
}
const writeModify = {
    dragModify : async (body) => {
         
        const result = await dao.writeModify.dragModify(body)
        return result.rowsAffected;
    },
    modifySchedule : async (body) => {
        if(body[0].private){
            body[0].private = 'on'
        } else {
            body[0].private = 'off'
        }
        if(!('private' in body[1])){
            body[1].private = 'off'
        } 
        const result = await dao.writeModify.modifySchedule(body)
        return result.rowsAffected;
    },
}

module.exports = {readViews, writeInsert, writeDelete, writeModify}