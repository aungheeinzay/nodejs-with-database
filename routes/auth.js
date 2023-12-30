const express = require("express");
const {check, body}=require("express-validator");
const router = express.Router();
const authcontroller = require("../controllers/auth");
const User = require("../models/user");

router.get("/register",authcontroller.getregister);
router.post("/register",
check("email")//check is use for all ,body() also be use to watch form data
.isEmail()
.withMessage("please enter correct email")
.custom((value,{req})=>{
    return User.findOne({email:value}).then((user)=>{
        if(user){
           return Promise.reject("email is already exist");
        }
    })
}),body("password")
.isLength({min:4})
.trim()
.withMessage("password must be grather than 4"),authcontroller.postregister);


router.get("/login",authcontroller.getlogin);
router.post("/login",body("email")
.isEmail()
.withMessage("no account exist"),
body("password")
.trim()
.isLength({min:4})
.withMessage("something wrong"),authcontroller.postlogin);
router.post("/logout",authcontroller.logout)
router.get("/resetPassword",authcontroller.forgetPassword);
router.get("/feedback",authcontroller.feedback);
router.post("/resetPassword",authcontroller.resetlink);
router.get("/newpassword/:token",authcontroller.getNewPassword);
router.post("/changenewpassword",body("password")
.trim()
.isLength({min:4})
.withMessage("password must be grather than 4"),
body("conform_password")
.trim()
.custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error("password must be same")
    }
    return true
}),authcontroller.changeRealPassword);
module.exports = router;