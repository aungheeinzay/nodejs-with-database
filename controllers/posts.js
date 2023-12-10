const post =require("../models/posts");
const posts=[];

exports.createpost = (req,res)=>{
    const {title,description,photo} = req.body;
    // console.log(`title value is ${title} and description values is ${description}`);
    // posts.push(
    //     {
    //         id:Math.random(),
    //         title,
    //         description,
    //         photo
    //     }
    // )
    const Post = new post(title,description);
   
    Post.setpsot().then( ()=>{ 
    res.redirect("/"); }).catch(err=>console.log(err))
}
exports.rendercreatepage = (req,res)=>{
    res.render("addpost",{title:"post create mal"});
}
exports.renderhomepage=(req,res)=>{
    // console.log(posts);
    // res.sendFile(path.join(__dirname,"..","views","homepage.html"));
    post.getallposts().then(([rows])=>{
        console.log(rows);
        res.render("home",{title:"hello word",postarr:rows});
    }).catch( err =>console.log(err) );
   
 };
 exports.renderdetials=(req,res)=>{
    const postid =Number(req.params.postId);
    // const post = posts.find((post)=>post.id===postid)
    // console.log(post);
    post.getSinglePost(postid).then(([row])=>{
        console.log(row);
        res.render("details",{title:"details page",post: row[0]})
    }).catch(err=>console.log(err));
    
 }