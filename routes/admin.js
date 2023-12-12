const express =require("express");
const router = express.Router();
const path=require("path")
const postcontroller = require("../controllers/posts");
// router.get("/createpost",(req,res)=>{
// // res.sendFile(path.join(__dirname,"..","views","addpost.html"));
// res.render("addpost",{title:"postcreatemal"});
// });
router.get("/createpost",postcontroller.rendercreatepage);
router.post("/",postcontroller.createpost);
router.post("/post/:postId",postcontroller.deletePost);
router.post("/post_edit/",postcontroller.updatepost);
router.get("/post_edit/:postId",postcontroller.oldData);
module.exports=router;