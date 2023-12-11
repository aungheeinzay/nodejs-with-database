const Sequlize = require("sequelize");
const sequlize = new Sequlize("blog","root","root",{
    host : "localhost",
    dialect : "mysql"
})
module.exports =sequlize;