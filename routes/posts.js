const express =require("express");
const router = express.Router();
const path = require("path");
const postcontroller = require("../controllers/posts")

router.get("/",postcontroller.renderhomepage);
router.get("/post/:postId",postcontroller.renderdetials);
// router.get("/post",(req,res)=>{
//      res.sendFile(path.join(__dirname,"..","views","postpage.html"))
//  });
 module.exports=router;