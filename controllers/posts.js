const post =require("../models/posts");
const posts=[];

exports.createpost = (req,res)=>{
    const {title,description,photo} = req.body;
    console.log(`title value is ${title} and description values is ${description}`);
    posts.push(
        {
            id:Math.random(),
            title,
            description,
            photo
        }
    )

    res.redirect("/"); 
}
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{title:"post create mal"});
}
exports.renderhomepage=(req,res)=>{
    // console.log(posts);
    // res.sendFile(path.join(__dirname,"..","views","homepage.html"));
 
        res.render("home",{title:"hello word",postarr:posts});
   
 };
 exports.renderdetials=(req,res)=>{
    const postid =Number(req.params.postId);
    const post = posts.find((post)=>post.id===postid)
    console.log(post);
    
        res.render("details",{title:"details page",post});
    
 }