const express =require("express");
const router = express.Router();
const {check,body}=require("express-validator");
const postcontroller = require("../controllers/posts");
const {islogin} = require("../middleware/login");

router.get("/createpost", postcontroller.rendercreatepage);
router.post("/",body("title")
.isLength({max:50})
.withMessage("title must be contain at most 50 letters"),postcontroller.createpost);
router.get("/updatepost/:postId",postcontroller.editPost);
router.post("/updatepost",
body("title")
.isLength({max:50})
.withMessage("title must be at most 50 letters"),postcontroller.updatePost);
router.post("/post/:postId",postcontroller.deletepost);

module.exports=router;