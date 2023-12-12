const mongodb = require("mongodb");
const mongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();

const mongodbconnector=()=>{
    mongodbClient.connect(process.env.MONGODB_URL).then((result)=>{
        console.log("connected to data base");
        console.log(result);
    })
    .catch(err=>{console.log(err);})
};
module.exports = mongodbconnector;