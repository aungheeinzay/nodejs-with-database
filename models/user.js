const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const userSchema = new Schema({
    username:{
        type: String,
        unique:true,
        require:true,
        minLenght:3,
        maxLength:15
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type: String,
        unique:true,
        minLenght:4
    }
});
module.exports = model("User",userSchema);