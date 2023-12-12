const express =require("express");
const path = require("path");
const bp = require("body-parser");
const db = require("./utils/database.js");
const Post = require("./models/posts.js");
const User =require("./models/user.js");

const app = express();
app.set("view engine","ejs");
app.set("views","views");
const postrouter = require("./routes/posts.js");
const adminrouter=require("./routes/admin.js");
const user = require("./models/user.js");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

app.use((req,res,next)=>{
    User.findByPk(1).then((user)=>{
        req.user =user;
        next();
    }).catch(err=>console.log(err));
})
app.use(bp.urlencoded({extended:false}));
app.use((req,res,next)=>{
    console.log(" i am parent middleware");
    next();
});
app.use("/post",(req,res,next)=>{
    console.log("i am post middleware");
    next();
})
app.use("/admin",(req,res,next)=>{
    console.log(" i am admin middleware ");
    User.hasMany(Post);
    next();
});

app.use(postrouter);
app.use("/admin",adminrouter);

Post.belongsTo(User, {constraints : true, onDelete : "CASCADE"});
User.hasMany(Post);
db.sync().then((result)=>{
   return User.findByPk(1)
}).then((user)=>{
    if(!user){
        return User.create({name : "aung heein zay", email : "ahz007aunghz@gmail.com"});
    }
    return user;
}).then((user)=>{
    console.log(user);
    app.listen(1000);
})
.catch(err=>{console.log(err);})
