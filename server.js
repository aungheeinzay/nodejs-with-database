const express =require("express");
const path = require("path");
const bp = require("body-parser");
const mongoose =require("mongoose")
const dotenv =require("dotenv").config();
const session = require("express-session");
const mongostore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash")
const multer = require("multer");

const app = express();
app.set("view engine","ejs");
app.set("views","views");
const postrouter = require("./routes/posts.js");
const adminrouter=require("./routes/admin.js");
const authrouter = require("./routes/auth.js");
const errorcontroller= require("./controllers/error.js")
const User =require("./models/user.js");
const {islogin} = require("./middleware/login.js");



app.use(express.static(path.join(__dirname,"public")));
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use(express.json());

const store = new mongostore({
    uri:process.env.MONGODB_URI,
    collection:"session",
}) ;

const csrfProtact = csrf()

const storageConfogure = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads")
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now()+ '-' + Math.round(Math.random() *1E9)
        cb(null,uniqueSuffix + '$' + file.originalname)
    }
})
const fileFilterConfigure = (req,file,cb)=>{
    if(file.mimetype === "image/jpeg"|| 
       file.mimetype ==="image/jpg" ||
       file.mimetype === "image/png"){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
app.use(bp.urlencoded({extended:false}));
app.use(multer({storage : storageConfogure,fileFilter : fileFilterConfigure}).single("photo"));

app.use(session({
    secret :process.env.SESSION_KEY,
    resave :false,
    saveUninitialized :false,
    store
}));

app.use(csrfProtact);
app.use(flash());
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

app.all("*",errorcontroller.errorpage);
app.use(errorcontroller.detailerror);

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to mongoose");
    app.listen(5500);
}).catch(err=>console.log(err));
