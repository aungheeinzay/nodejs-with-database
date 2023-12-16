const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth");

router.get("/login",authcontroller.getlogin);
router.post("/login",authcontroller.postlogin);
module.exports = router;