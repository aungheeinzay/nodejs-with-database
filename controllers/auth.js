const User= require("../models/user");
const bcrypt =require("bcrypt")
exports.getregister = (req,res)=>{
    res.render("auth/register",{title : "register"});
}

exports.postregister = (req,res)=>{
    const {email,password} = req.body;
    User.findOne({email}).then((user)=>{
        if(user){
            return res.redirect("/register");
        }
        return bcrypt.hash(password,10).then((hashPassword)=>{
        return User.create({
                email,
                password:hashPassword,
            })
        })
        .then(()=>{
            res.redirect("/login")
        })
    }).catch(err=>console.log(err))
}

exports.getlogin = (req,res)=>{
    res.render("auth/login",{title : "login"});
}
//handle login
exports.postlogin = (req,res)=>{
    const {email,password} = req.body;
    User.findOne({email}).then((user)=>{
        if(!user){
            return res.redirect("/login")
        }
        bcrypt
        .compare(password, user.password)
        .then((ismatch)=>{
            if(ismatch){
                req.session.islogin = true;
                req.session.userinfo = user;
                return req.session.save((err)=>{
                    res.redirect("/");
                    console.log(err);
                })
               
            }
            res.redirect("/login")
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
};

exports.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
}
exports.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    })
}