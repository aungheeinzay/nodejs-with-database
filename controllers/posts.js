
const Post =require("../models/posts");


exports.createpost = (req,res)=>{
    const {title,description} = req.body;
    Post.create({
        title,
        description,
        userId : req.user
    }).then(
        (result)=>{
            console.log(result);
            res.redirect("/");
        }
    ).catch(err=>console.log(err));
}
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{title:"post create mal"});
}
exports.renderhomepage=(req,res)=>{
    Post.find().select("title description")
    .populate("userId", "email").sort({title: -1}).then((posts)=>{
        res.render("home",{
            title:"hello word",
            postarr:posts,
            currentUserEmail:req.session.userinfo ? req.session.userinfo.email : null
        });
    }).catch(err=>console.log(err));
        
   
 };
 exports.renderdetials=(req,res)=>{
    const postid =req.params.postId;
    console.log("render detail"+req.user);
    Post.findById(postid).then((post)=>{
          res.render("details",{
            title:`${post.title}`,
            post,
            currentUserId:req.user ? req.user._id : ""

        });
    }).catch(err=>console.log(err));
 }

 exports.editPost =(req,res)=>{
    const postid =req.params.postId;
    Post.findById(postid).then((post)=>{
        res.render("updatepost",{
            title :`${post.title}`,
            post
        })
    }
      
    ).catch(err=>console.log(err));
 }

 exports.updatePost = (req,res)=>{
    const{postid,title,description}= req.body;
    Post.findById(postid).then((post)=>{
        if(post.userId.toString() !== req.user._id.toString()){
            return res.redirect("/");
        }
        post.title = title;
        post.description = description;
        return post.save().then(()=>{
            res.redirect("/");
        })
    }).catch(err=>console.log(err));
 }
exports.deletepost = (req,res)=>{
    const postid = req.params.postId;
    // Post.findByIdAndDelete({_id : postid})
    Post.deleteOne({_id:postid,userId:req.user._id}).then(
        ()=>{
            res.redirect("/");
        }
    ).catch(err=>console.log(err))
}