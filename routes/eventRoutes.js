const { Router } = require("express");
const router = Router();

const eventControllers = require("../controllers/eventControllers");

router.get("/getFirst", eventControllers.entryEventData_get);
router.get("/getAll", eventControllers.alleventData_get);
router.post("/getSingleEvent", eventControllers.singleEvent_post);
router.get("/getFlagshipEvents", eventControllers.getFlagShipEvents_get);
router.post("/getSpecificEvents", eventControllers.getEvents_post);

module.exports = router;
