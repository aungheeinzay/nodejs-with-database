
const Post =require("../models/posts");


exports.createpost = (req,res)=>{
    const {title,description,photo} = req.body;
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
//    const cookie = req.get("Cookie").split("=")[1].trim()==="true";
//    console.log(cookie);
    Post.find().select("title")
    .populate("userId", "username").sort({title: -1}).then((posts)=>{
        console.log(posts);
        res.render("home",{title:"hello word",postarr:posts,islogin:req.session.islogin ? true : false});
    }).catch(err=>console.log(err));
        
   
 };
 exports.renderdetials=(req,res)=>{
    const postid =req.params.postId;
    Post.findById(postid).then((post)=>{
          res.render("details",{title:`${post.title}`,post});
    }).catch(err=>console.log(err));
 }

 exports.editPost =(req,res)=>{
    const postid =req.params.postId;
    Post.findById(postid).then((post)=>{
        res.render("updatepost",{title :`${post.title}`,post})
    }
      
    ).catch(err=>console.log(err));
 }

 exports.updatePost = (req,res)=>{
    const{postid,title,description}= req.body;
    Post.findById(postid).then((post)=>{
        post.title = title;
        post.description = description;
        return post.save().then(()=>{
            res.redirect("/");
        })
    }).catch(err=>console.log(err));
 }
exports.deletepost = (req,res)=>{
    const postid = req.params.postId;
    Post.findByIdAndDelete({_id : postid}).then(
        ()=>{
            res.redirect("/");
        }
    ).catch(err=>console.log(err))
}