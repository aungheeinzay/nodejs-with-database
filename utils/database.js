const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();

let db;
const mongodbconnector=()=>{
    mongodbClient.connect(process.env.MONGODB_URL).then((result)=>{
        console.log("connected to data base");
        db = result.db()
        console.log(result);
    })
    .catch(err=>{console.log(err);})
};
const getdatabase =()=>{
    if(db){
        return db;
    }
    throw "no data base";
}

module.exports = {mongodbconnector,getdatabase};