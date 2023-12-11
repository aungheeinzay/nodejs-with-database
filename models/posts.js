const Sequlize = require("sequelize");
const sequlize = require("../utils/database");
const post =sequlize.define("post",{
    id : {type: Sequlize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    title : {
        type : Sequlize.STRING,
        allowNull : false
    },
    description : {
        type : Sequlize.STRING,
        allowNull : false
    }
});
module.exports = post;