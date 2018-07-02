const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    origin: String,
    key: String,
    title: String,
    writer: String,
    content: String,
    date: Number,
    isPrivate: Boolean,
    hasComment: Boolean,
    commentCnt : Number,
    viewCnt : Number,
    like: String,       // , 쉼표로 구분
    deleted: Boolean,
    uuid: String,
    context: String
});

module.exports = mongoose.model('Post', postSchema, "posts");
