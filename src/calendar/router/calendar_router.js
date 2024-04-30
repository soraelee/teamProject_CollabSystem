const router = require("express").Router();
const ctrl = require("../controller/calendar_controller")

router.get("/", ctrl.views.calendar)
router.get("/eventList/", ctrl.process.calList);
router.get("/write_from", ctrl.views.write_form);
router.post("/add_schedule", ctrl.process.addSchedule);
router.get("/modify_form", ctrl.views.modifyFrom);
router.put("/modify_schedule", ctrl.process.modifySchedule);
router.delete("/write_delete", ctrl.process.delete);
router.put("/drag_modify", ctrl.process.dragModify);
router.get("/team_selector", ctrl.views.teamSelector);
router.get("/team/:teamname", ctrl.process.teamGetter);
router.get("/private", ctrl.process.privateRead);

module.exports = router;