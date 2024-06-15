import express from "express";

import jwt from "jsonwebtoken";

import { Post, User } from "../db-utils/models.js";

const postsRouter = express.Router();

// Create a new post
postsRouter.post("/", async (req, res) => {
  const token = req.headers["authorization"];

  const postData = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    const poData = {
      ...postData,
      id: Date.now().toString(),
      userName: decoded.email,
      profilePic: user.image,
      likes: 0,
    };
    const newPost = new Post(poData);
    await newPost.save();

    res.status(201).json({
      message: "Post Created Successfully",
      newPost: poData,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Edit a post

// Delete a post
postsRouter.delete("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    await Post.deleteOne({ id: postId });
    res.send({ msg: "Post Delete Success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Read all the posts from a the logged in user
postsRouter.get("/", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const posts = await Post.find(
      { userName: decoded.email },
      { _id: 0, __v: 0 }
    );
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Read the Posts from other users --> to be shown in home page
postsRouter.get("/other-posts", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const posts = await Post.find(
      { userName: { $ne: decoded.email } },
      { _id: 0, __v: 0 }
    );
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

export default postsRouter;
