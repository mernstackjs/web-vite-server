const {
  createPost,
  getAllPost,
  postById,
  deletePost,
  myPost,
} = require("../controller/post");
const { isAuthantication } = require("../middleware/isAuthantication");

module.exports = (router) => {
  router.post("/create-post", isAuthantication, createPost);
  router.get("/post", getAllPost);
  router.get("/post/:id", postById);
  router.delete("/post/:id", isAuthantication, deletePost);
  router.get("/my-posts", isAuthantication, myPost);
};
