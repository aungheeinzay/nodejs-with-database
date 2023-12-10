const mysql=require("mysql2");

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    database:"blog",
    password:"root"
});
module.exports=pool.promise();