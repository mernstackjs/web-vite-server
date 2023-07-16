const Post = require("../model/post");
const User = require("../model/user");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const user = await User.findById(req.user).select("+emailVerify");

    if (!user.emailVerify) return res.json("You have to verify your email ");
    const post = await Post.create({ content, title, author: req.user });
    return res.status(201).json(post);
  } catch (error) {
    return res.json({ error });
  }
};
exports.getAllPost = async (req, res) => {
  try {
    const post = await Post.find().populate("author", "-_id -email");
    return res.status(201).json(post);
  } catch (error) {
    return res.json({ error });
  }
};
exports.postById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.status(201).json(post);
  } catch (error) {
    return res.json({ error });
  }
};
exports.myPost = async (req, res) => {
  const userID = req.user;
  try {
    const post = await Post.find({ author: userID });
    if (post.length > 0) return res.status(200).json(post);
    res.status(404).json({ message: "Don't have an post yet" });
  } catch (error) {
    return res.json({ error });
  }
};

// Assuming you have imported the required modules and defined the Post model

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userID = req.user;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = userID.toString();
    const postAuthor = post.author.toString();

    if (userId !== postAuthor) {
      return res.json({ message: "You can delete only your post" });
    }
    await Post.deleteOne(post);
    res.json({ message: `The post with ID ${id} has been deleted` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
