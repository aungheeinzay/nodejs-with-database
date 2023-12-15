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
app.use(postrouter);
app.use("/admin",adminrouter);

mongoose.connect(process.env.MONGODB_URL).then(result=>{
    console.log(result);
    app.listen(1000);
}).catch(err=>console.log(err));
