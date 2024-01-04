const fs = require("fs");
const filedelete = (filepath)=>{
    fs.unlink(filepath,(err)=>{
        if(err) throw err;
        console.log("photo was deleted");
    })
}
module.exports = filedelete