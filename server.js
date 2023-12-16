const express =require("express");
const path = require("path");
const bp = require("body-parser");
const mongoose = require("mongoose");
const dotenv =require("dotenv").config();
const app = express();
app.set("view engine","ejs");
app.set("views","views");
const postrouter = require("./routes/posts.js");
const adminrouter=require("./routes/admin.js");
const authrouter = require("./routes/auth.js");
const User =require("./models/user.js");


app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

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
    next();
});
app.use((req,res,next)=>{
    User.findById("657c6876330844364cf279fc").then((user)=>{
        req.user= user;
        next();
    })
})
app.use(postrouter);
app.use("/admin",adminrouter);
app.use(authrouter);

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to mongoose");
    app.listen(1000);
    User.findOne().then((user)=>{
        if(!user){
           return User.create({
                username : "Aung heein",
                email: "aunghz@gmail.com",
                password: "asdfgh"});
        }
        return user;
    }).then(result=>console.log(result))
}).catch(err=>console.log(err));
