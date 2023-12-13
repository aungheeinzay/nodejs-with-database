const mongodb =require("mongodb");
const {getdatabase} = require("../utils/database");
class Post {
    constructor(title,description){
        this.title=title,
        this.description=description
    }
    create(){
        const db = getdatabase();
        return db.collection("post").insertOne(this).then((result)=>{
            console.log(result);
        }).catch(err=>console.log(err))
    }
    static getallposts(){
        const db = getdatabase();
        return db.collection("post").find().toArray().then((posts)=>{
            console.log(posts);
            return posts;})
        .catch(err=>console.log(err));
    }
    static getpost(postid){
        const db = getdatabase();
        return db.collection("post").find({ _id: new mongodb.ObjectId(postid) }).next()
        .then((post)=>{
            console.log(post);
            return post;
        })
        .catch(err=>console.log(err));
    }
}
module.exports = Post;