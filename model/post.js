const mongoose = require("mongoose");
const postShema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postShema);

module.exports = Post;
