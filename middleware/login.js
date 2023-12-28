exports.islogin=(req,res,next)=>{
    if(req.session.islogin===undefined){
        return res.redirect("/");
    }
    next();
}