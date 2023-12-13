
const Post =require("../models/posts");


exports.createpost = (req,res)=>{
    const {title,description,photo} = req.body;
    const post =new Post(title,description);
    post.create().then((result)=>{
        console.log(result);
        res.redirect("/");
    }).catch(err=>console.log(err))

}
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{title:"post create mal"});
}
exports.renderhomepage=(req,res)=>{
    Post.getallposts().then((posts)=>{
        res.render("home",{title:"hello word",postarr:posts});
    }).catch(err=>console.log(err));
        
   
 };
 exports.renderdetials=(req,res)=>{
    const postid =req.params.postId;
    Post.getpost(postid).then((post)=>{
          res.render("details",{title:`${post.title}`,post});
    }).catch(err=>console.log(err))
    
        
    
 }