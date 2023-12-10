const db =require("../utils/database");
module.exports= class post{
    constructor(title,description){
        this.title = title,
        this.description =description
    }
    setpsot(){
        return db.execute("INSERT INTO posts (title,description) VALUES (?,?)",[this.title,this.description]);
    }
    static getallposts(){
        return db.execute("SELECT * FROM posts");
    }
    static getSinglePost(id){
        return db.execute("SELECT * FROM posts WHERE posts.id = ?",[id]);
    }
}