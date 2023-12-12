const express =require("express");
const path = require("path");
const bp = require("body-parser");
const app = express();
app.set("view engine","ejs");
app.set("views","views");
const postrouter = require("./routes/posts.js");
const adminrouter=require("./routes/admin.js");

const mongodb = require("./utils/database.js");

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

mongodb();
app.listen(1000);