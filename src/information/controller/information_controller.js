const ser = require("../service/information_service")

const views = {
    information : async (req, res) => {
        const users = await ser.viewInfo.infoUser();
        const userPosition = req.session
        const team = await ser.viewInfo.teamGetter();
        console.log("userPosition", userPosition)
        res.render("information", { users , userPosition, team });
    },
    organization : async (req, res) => {
            const users = await ser.getOrganizationInfo();
            const teams = {};

            users.forEach(user => {
                if (!teams[user.TEAM]) {
                    teams[user.TEAM] = { PM: [], dev: [], client: [] };
                }
                if (user.POSITION === 'PM') {
                    teams[user.TEAM].PM = user;
                } else if(user.POSITION === 'dev'){
                    teams[user.TEAM].dev.push(user);
                } else if(user.POSITION === 'client'){
                    teams[user.TEAM].client.push(user);
                }
            });
            res.render("organization", { teams });
    },
    userInfoPage : async (req, res) => {
            const user_id = req.session.result.userId;  
            console.log("my session", user_id);  
            const currentUser = await ser.getCurrentUserInfo(user_id);
            console.log("currentUser", currentUser)
            res.render("userInfo", { user: currentUser });
    }
}
const process = {
    modifyPage: async (req, res) => {
        const userId = req.params.userId;
        const currentUser = await ser.getCurrentUserInfo(userId);
        res.render("modify", { user: currentUser });
    },
    handleModify: async (req, res) => {
        console.log("InfoCtrlbodyModi:",req.body.id,"userId:",req.params)
        const userId = req.params.userId;
        const updatedUserInfo = req.body;
        try {
            // 수정된 정보를 데이터베이스에 업데이트
            const msg = await ser.userInfoModify(userId, updatedUserInfo);
            console.log("msg", msg)
            if(msg==1){
                res.json(msg)
            }else{
                res.json(0) 
            }
        } catch (error) {
            console.error("Error", error);
        }
    },
    teamModify : async (req, res) => {
        const teamForm = req.body;
        const msg = await ser.teamModify(teamForm);
        res.json(msg)
    },
    teamMaker : async(req, res) => {
        const result = await ser.teamMaker(req.body);
        res.json(result);
    }
}

module.exports = { views, process };
