const express =require("express");
const path = require("path");
const bp = require("body-parser");
const mongoose = require("mongoose");
const dotenv =require("dotenv").config();
const session = require("express-session");
const mongostore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const app = express();
app.set("view engine","ejs");
app.set("views","views");
const postrouter = require("./routes/posts.js");
const adminrouter=require("./routes/admin.js");
const authrouter = require("./routes/auth.js");
const User =require("./models/user.js");
const {islogin} = require("./middleware/login.js");



app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

app.use(bp.urlencoded({extended:false}));

const store = new mongostore({
    uri:process.env.MONGODB_URI,
    collection:"session",
}) 

const csrfProtact = csrf()

app.use(session({
    secret :process.env.SESSION_KEY,
    resave :false,
    saveUninitialized :false,
    store
}));

app.use(csrfProtact);

app.use((req,res,next)=>{
    if(req.session.islogin===undefined){
        return next();
    }
    User.findById(req.session.userinfo._id).select("_id email").then((user)=>{
        req.user = user;
        console.log(req.user)
        next();
    })
    .catch(err=>console.log(err))
});

//to sent csrf token for everyroute
app.use((req,res,next)=>{
    res.locals.islogin = req.session.islogin ? true : false,
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(postrouter);
app.use("/admin",islogin,adminrouter);
app.use(authrouter);

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to mongoose");
    app.listen(1000);
}).catch(err=>console.log(err));
