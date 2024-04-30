const ser = require("../service/calendar_service")

const views = {
    calendar : async (req, res) => {
        const user_id = req.session.result.userId;
        // const user_id = 'hhh';
        const result = await ser.readViews.readCal(user_id)
        const group = await ser.readViews.teamGroupMake();
        res.render("calendar", {data : result, group, user_id})
        // res.render("calendar");
    },
    write_form : (req, res) => {

        res.json("write_form")
    },
    modifyFrom : (req, res) => {

        res.json("modify_form")
    },
    teamSelector : async (req, res) => {
        res.json("team_selector")
    }
}

const process = {
    calList : async (req, res) => {
        const user_id = req.session.result.userId;
        const result = await ser.readViews.readCal(user_id)
        res.json(result)
    },
    addSchedule : async (req, res) => {
        const user_id = req.session.result.userId;
        const result = await ser.writeInsert.addSchedule(req.body, user_id)
        res.json(result)
    },
    modifySchedule : async (req, res) => {
        const result = await ser.writeModify.modifySchedule(req.body)
        res.json(result)
    },
    delete : async (req, res) => {
        const result = await ser.writeDelete.deleteSchedule(req.body)

        res.json(result)
    },
    dragModify : async (req, res) => {
        const result = await ser.writeModify.dragModify(req.body)

        res.json(result)
    },
    teamGetter : async (req, res) => {
        //팀명을 전달하여 팀별 정보를 가져옴
        const result = await ser.readViews.teamGetter(req.params.teamname)

        res.json(result)
    }, 
    privateRead : async (req, res) => {
        //개인 스케줄 가져오기
        const user_id = req.session.result.userId;
        const result = await ser.readViews.privateRead(user_id)

        res.json(result)
    }
}
module.exports = {views, process}