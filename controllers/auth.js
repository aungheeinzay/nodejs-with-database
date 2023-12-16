exports.getlogin = (req,res)=>{
    res.render("auth/login",{title : "login"});
}
exports.postlogin = (req,res)=>{
    // res.setHeader("Set-Cookie","isLogin=true");
    req.session.islogin = true;
    res.redirect("/");
}
exports.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });

}