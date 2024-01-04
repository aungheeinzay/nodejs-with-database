
const Post =require("../models/posts");
const {validationResult} =require("express-validator");
const { format } = require("date-fns");
// formatISO9075
const filedelete = require("../utils/fileDelete");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const expath = require("path");
const e = require("connect-flash");

const postPerPage = 3;

exports.createpost = (req,res,next)=>{
    const {title,description} = req.body;
    const photo = req.file;
    // if(photo === undefined){
    //     return res.status(422).render("addpost",{
    //         title:"post create mal",
    //         error:"invaild image",
    //         oldformdata:{title,description}
    //     });
    // }
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
        photo:photo ? photo.path : "",
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
    //page1=3post skip
    //page2 = 6 post skip
    //page3 =6post skip
    let totalPostCount;
    const pagenumber = +req.query.page || 1;
    Post.find().countDocuments().then((totalPost)=>{
        totalPostCount = totalPost;
    return  Post.find().select("title description")
    .populate("userId", "email").skip((pagenumber-1)*postPerPage).limit(postPerPage)
    .sort({createdAt: -1})
    }).then((posts)=>{
        if(posts.length == 0){
            return res.status(500).render("error/404",{
                title:"error",
            })
        }
         res.render("home",{
            title:"hello word",
            postarr:posts,
            currentUserEmail:req.session.userinfo ? req.session.userinfo.email : null,
            currentPage:pagenumber,
            hasNextPage: postPerPage*pagenumber < totalPostCount,// pya pee thor tay post < database post
            hasPreviousPage:pagenumber>1,
            nextPage:pagenumber+1,
            previousPage:pagenumber - 1
        });
    })
   .catch(err=> {
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
    const photo = req.file;
    console.log( "update photo"+ photo);
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
        if(post.photo){
            filedelete(post.photo);
            post.photo = photo.path;
        }else{
            post.photo = photo.path;
        }
        return post.save().then(()=>{
            res.redirect("/");
        })
    }).catch(err=>console.log(err));
 }
exports.deletepost = (req,res)=>{
    const postid = req.params.postId;
    // Post.findByIdAndDelete({_id : postid})
    Post.findById(postid).then((post)=>{
        if(!post){
            return res.redirect("/");
        }
        if(post.photo){
            filedelete(post.photo);
        }
        
        return Post.deleteOne({_id:postid,userId:req.user._id})
    }).then( ()=>{
            res.redirect("/");
        }).catch((err)=>{
        console.log(err);
        const error = new Error("post not found")
        return next(error);
    })
};
exports.saveaspdf = (req,res,next)=>{
    const {id} = req.params;
    const templateurl = `${expath.join(__dirname,"../views/template/template.html")}`
    const html = fs.readFileSync(templateurl,"utf-8");
    const options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">PDF download from blog.io</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                default: '<span style="color: #444;">@aungheein zay</span>', 
                last: 'Last Page'
            }
        }
    };
  
    Post.findById(id).populate("userId","email").lean().then((post)=>{
       const date = new Date();
       const pdfSaveUrl = `${expath.join(__dirname,"../public/pdf",date.getTime() + ".pdf")}`;
       const document = {
        html,
        data: {
            post
        },
        path: pdfSaveUrl,
        type: ""
    };
    pdf.create(document,options)
    .then((result) => {
        res.download(pdfSaveUrl,(err)=>{
            if(err) throw (err)
        });
        filedelete(pdfSaveUrl);
        
      })
      .catch((error) => {
        console.error(error);
      });
    }).catch(err=>{
        console.log(err);
        const error = new Error("post not found")
        return next(error);
    });
}