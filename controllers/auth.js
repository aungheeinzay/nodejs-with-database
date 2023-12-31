const User= require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt =require("bcrypt")
const env = require("dotenv").config();
const crypto = require("crypto");
// const { errorMonitor } = require("events");
// const { log } = require("console");
const user = require("../models/user");
const { resourceUsage } = require("process");
const {validationResult} = require("express-validator");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user:process.env.SENDER_MAIL,
        pass:process.env.MAIL_PASSWORD
    }
})
exports.getregister = (req,res)=>{
    res.render("auth/register",{
        title : "register",
        err:"",
        oldformData:{email:"",password:""}});
}

exports.postregister = (req,res)=>{
    const {email,password} = req.body;

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render("auth/register",{
            title : "register",
            err :errors.array()[0].msg,
            oldformData:{email,password}
        });
    }  
     bcrypt.hash(password,10).then((hashPassword)=>{
        return User.create({
                email,
                password:hashPassword,
            })
        })
        .then(()=>{
            res.redirect("/login");
            transporter.sendMail({
                from: process.env.SENDER_MAIL,
                to : email,
                subject : "Register successful",
                html : `<h2>Register account successful</h2>
                        <p> using this ${email} </P>
                        <p>you can post now in our blog.io</p>
                        `
            },(err=>console.log(err)))
        })
   .catch(err=>console.log(err))
}

exports.getlogin = (req,res)=>{
    let message = req.flash("erroruser");
   
    res.render("auth/login",{
        title : "login",
        err:"",
        oldformData:{email:"",password:""}
    });
}
//handle login
exports.postlogin = (req,res)=>{
    const {email,password} = req.body;
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render("auth/login",{
            title : "login",
            err :errors.array()[0].msg,
            oldformData:{email,password}
        });
    }
    User.findOne({email}).then((user)=>{
        if(!user){
            // req.flash("erroruser","something wrong and try agin");
            // return res.redirect("/login")
            return res.status(422).render("auth/login",{
                title : "login",
                err :"check your email and password",
                oldformData:{email,password}
            });
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
            return res.status(422).render("auth/login",{
                title : "login",
                err :"check your email and password",
                oldformData:{email,password}
            });
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
};

//renderforgetpassword
exports.forgetPassword = (req,res)=>{
    let message = req.flash("error");
    if(message.length>0){
        messagge = message[0];
    }else{
        message=null;
    }
    res.render("auth/reset",{
        title : "reset_passwod" ,
        err :"",
        oldformData:""
    });
};

//renderffebackpage
exports.feedback = (req,res)=>{
    res.render("auth/feedback",{
        title : "feedback" ,
    });
};


//resultpassword link send
exports.resetlink=(req,res)=>{
    const {email} = req.body;
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(422).render("auth/reset",
        {
            title:"resetPassword",
            err :err.array()[0].msg,
            oldformData:email
        })
    }
    crypto.randomBytes(30,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/resetPassword");
        }
        const token = buffer.toString("hex");
        User.findOne({email}).then((user)=>{
            if(!user){
                return res.status(422).render("auth/reset",{
                    title:"resetPassword",
                    err:"account not exist",
                    oldformData:email
                })
            }
            user.resetToken = token;
            user.tokenExpiration = Date.now()+180000;
            return user.save();
        }).then((result)=>{
            res.redirect("/feedback");
            transporter.sendMail({
                from: process.env.SENDER_MAIL,
                to : email,
                subject : "Reset Password",
                html : `<h2>Reset password</h2>
                        <p> cahange your account password </P>
                        <p>by clicking this link</p>
                        <a href="http://localhost:5500/newpassword/${token}" target="_blank">click here</a>
                        `
            },(err=>console.log(err))
            )
        }).catch(err=>console.log(err));
    })
};

//change password
exports.getNewPassword = (req,res)=>{
    const {token} = req.params;
    User.findOne({
        resetToken : token,
        tokenExpiration : {$gt :Date.now()}}).then((user)=>{
            let message = req.flash("error","password must be same");
            if(message.length>0){
                message = message[0];
            }
            else{
                message=null;
            }

            res.render("auth/newPassword",{
                title:"chanePassword",
                errormsg:message,
                token,
                user_id:user._id,
                oldformData:{password:"",conform_password:""}
            })
        }).catch(err=>console.log(err));
   
};

//change password
exports.changeRealPassword = (req,res)=>{
    const{password,conform_password,token,user_id}=req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render("auth/newPassword",{
            title : "changePassword",
            errormsg :errors.array()[0].msg,
            token,
            user_id,
            oldformData:{password,conform_password}
        });
    }
    let resultuser;
    User.findOne({resetToken:token,tokenExpiration:{$gt : Date.now()},_id:user_id})
    .then((user)=>{
        resultuser = user;
        if(password===conform_password){
            return bcrypt.hash(password,10);
        }

    }).then((hashPassword)=>{
        resultuser.password = hashPassword;
        resultuser.resetToken = undefined;
        tokenExpiration = undefined;
        return resultuser.save();
    }).then(()=>{
       return res.redirect("/login");
    }).catch(err=>console.log(err))
}