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
    Post.findAll({ order : [
        ['createdAt', 'desc']
    ]}).then((posts)=>{
        res.render("home",{title : "home page",postarr : posts});
    }).catch(err=>console.log(err))
    
 };
 exports.renderdetials=(req,res)=>{
    const postid =req.params.postId;
    Post.findOne({ where : { id : postid }}).then((post)=>{
        res.render("details",{title : `${post.title}`,post})
    }).catch(err=>console.log(err));
    
    // Post.findByPk(postid).then((post)=>{
    //     res.render("details",{title : "single post",post})
    // }).catch(err=>console.log(err));
    
 }
 exports.deletePost = (req,res)=>{
    const postid =req.params.postId;
    Post.findByPk(postid).then((post)=>{
        if(!post){
            res.redirect("/");
        }
        return post.destroy().then(()=>{
            res.redirect("/");
            console.log("post deleted");
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err));
    console.log("delete post"+ postid);
 }
exports.oldData = (req,res)=>{
    const postid =req.params.postId;
    Post.findByPk(postid).then((post)=>{
        res.render("editPost",{title : `${post.title}`,post})
    }).catch(err=>console.log(err));
}
exports.updatepost = (req,res)=>{
    const {postid,title,description}=req.body;
    Post.findByPk(postid).then((updatePost)=>{
        updatePost.title=title,
        updatePost.description=description
        return updatePost.save().then((result)=>{
            console.log(result);
            res.redirect("/");
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
}