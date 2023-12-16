exports.getlogin = (req,res)=>{
    res.render("auth/login",{title : "login"});
}
exports.postlogin = (req,res)=>{
    res.setHeader("Set-Cookie","isLogin=true");
    res.redirect("/");
}