const PostModel = require("../models/Post");
const NotificationModel = require("../models/Notification");
const { errorResponseHandler } = require("../helper/errorResponseHandler");
const createPost = async (req, res) => {
  try {
    const { description, } = req.body;
    const { teacherId } = req.user;
    const data = { description, teacherId };
    const createdPost = await PostModel.createNewPost(data);
    console.log("data", createdPost)
    res.status(201).json({
      message: 'Upload successfully ',
      posts: createdPost
    });
  } catch (err) {
    errorResponseHandler(err, req, res);
  }
};
const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.getAllPost();
    res.success(posts, "Post  fetched successfully");
  } catch (err) {
    errorResponseHandler(err, req, res);
  }
};
module.exports = {
  createPost,
  getAllPost
}