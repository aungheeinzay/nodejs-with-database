const express =require("express");
const router = express.Router();
const postcontroller = require("../controllers/posts");

router.get("/createpost",postcontroller.rendercreatepage);
router.post("/",postcontroller.createpost);
router.get("/updatepost/:postId",postcontroller.editPost);
router.post("/updatepost",postcontroller.updatePost);
router.post("/post/:postId",postcontroller.deletepost);

module.exports=router;