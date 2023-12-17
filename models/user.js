const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const userSchema = new Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type: String,
        unique:true,
    }
});
module.exports = model("User",userSchema);