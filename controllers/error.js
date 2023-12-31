exports.errorpage=(req,res)=>{
    res.status(404).render("error/404",{
        title:"Page not found"
    });
}
exports.detailerror=(err,req,res,next)=>{
    res.status(500).render("error/505",{
        title:"post error",
        msg:err.message
    })
}