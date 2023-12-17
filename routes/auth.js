const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth");

router.get("/register",authcontroller.getregister);
router.post("/register",authcontroller.postregister);
router.get("/login",authcontroller.getlogin);
router.post("/login",authcontroller.postlogin);
router.post("/logout",authcontroller.logout)
module.exports = router;