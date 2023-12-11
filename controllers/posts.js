const { reset } = require("nodemon");
const Post =require("../models/posts");
// const posts=[];

exports.createpost = (req,res)=>{
    const {title,description,photo} = req.body;
    Post.create({
        title,
        description
    }).then((result)=>{
        console.log(result);
        res.redirect("/");
    }).catch((err)=>console.log(err));
};
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{title:"post create mal"});
}
exports.renderhomepage = (req,res)=>{
    Post.findAll().then((posts)=>{
        res.render("home",{title : "home page",postarr : posts});
    }).catch(err=>console.log(err))
    
 };
 exports.renderdetials=(req,res)=>{
    const postid =req.params.postId;
    Post.findOne({ where : { id : postid }}).then((post)=>{
        res.render("details",{title : "single post",post})
    }).catch(err=>console.log(err));
    
    // Post.findByPk(postid).then((post)=>{
    //     res.render("details",{title : "single post",post})
    // }).catch(err=>console.log(err));
    
 }