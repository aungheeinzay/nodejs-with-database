const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth");

router.get("/register",authcontroller.getregister);
router.post("/register",authcontroller.postregister);
router.get("/login",authcontroller.getlogin);
router.post("/login",authcontroller.postlogin);
router.post("/logout",authcontroller.logout)
router.get("/resetPassword",authcontroller.forgetPassword);
router.get("/feedback",authcontroller.feedback);
router.post("/resetPassword",authcontroller.resetlink);
router.get("/newpassword/:token",authcontroller.getNewPassword);
router.post("/changenewpassword",authcontroller.changeRealPassword);
module.exports = router;