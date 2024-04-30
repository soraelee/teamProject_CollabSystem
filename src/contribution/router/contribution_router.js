const router=require("express").Router();
const contributionCtrl=require("../controller/contribution_controller");

//  router.get("/",contributionCtrl.ContributionView.mainView);

router.get("/selectTeam",contributionCtrl.ContributionView.selectTeam);
router.get("/forEachTeamData",contributionCtrl.contributionProcess.forEachTeamData);

router.get("/MVP",contributionCtrl.ContributionView.showMVP);


module.exports=router;