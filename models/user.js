const Sequlize = require("sequelize");
const sequlize = require("../utils/database");

const user = sequlize.define("user",{
    id: {
        type:  Sequlize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : Sequlize.STRING,
    email : Sequlize.STRING
});
module.exports = user;