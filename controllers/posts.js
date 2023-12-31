
const Post =require("../models/posts");
const {validationResult} =require("express-validator");
const { format } = require("date-fns");
// formatISO9075

exports.createpost = (req,res,next)=>{
    const {title,description} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render("addpost",{
            title:"post create mal",
            error:error.array()[0].msg,
            oldformdata:{title,description}

        })
    }
    Post.create({
        title,
        description,
        userId : req.user
    }).then(
        (result)=>{
            console.log(result);
            res.redirect("/");
        }
    ).catch(err=>{
        console.log(err);
        const error = new Error("error occour")
        return next(error);
    });
}
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{
        title:"post create mal",
        error:"",
        oldformdata:{title:"",description:""}
    });
}
exports.renderhomepage=(req,res,next)=>{
    Post.find().select("title description")
    .populate("userId", "email").sort({createdAt: -1}).then((posts)=>{
        res.render("home",{
            title:"hello word",
            postarr:posts,
            currentUserEmail:req.session.userinfo ? req.session.userinfo.email : null
        });
    }).catch(err=> {
        console.log(err);
        const error = new Error("post not found")
        return next(error);
    });
        
   
 };
 exports.renderdetials=(req,res,next)=>{
    const postid =req.params.postId;
    console.log("render detail"+req.user);
    Post.findById(postid).populate("userId","email").then((post)=>{
        console.log(post)
          res.render("details",{
            title:`${post.title}`,
            post,
            // date:post.createdAt ? format(post.createdAt, { representation: 'date' }) : "",
            date:post.createdAt ? format(post.createdAt,"h ':' mm  aaa") : "",
            currentUserId:req.user ? req.user._id : ""

        });
    }).catch(err=>{
        console.log(err);
        const error = new Error("post not found")
        return next(error);
    });
 }

 exports.editPost =(req,res)=>{
    const postid =req.params.postId;
    Post.findById(postid).then((post)=>{
        res.render("updatepost",{
            title :`${post.title}`,
            post,
            postid,
            error:"",
            oldformdata:{title:"",description:""},
            isValidationfail:false
        
        })
    }
      
    ).catch(err=>{
        console.log(err);
        const error = new Error("post not found")
        return next(error);
    });
 }

 exports.updatePost = (req,res)=>{
    const{postid,title,description}= req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).render("updatepost",{
            title:"updatepost",
            postid,
            error:error.array()[0].msg,
            oldformdata:{title,description,postid},
            isValidationfail:true

        })
    }
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