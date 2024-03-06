const { Router } = require("express");
const authControllers = require("../controllers/authControllers");

const router = Router();

router.post("/signup", authControllers.signup_post);
router.post("/login", authControllers.login_post);
router.get("/logout", authControllers.logout_get);
router.post("/email_check", authControllers.email_check_post);

module.exports = router;
