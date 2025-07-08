import { v4 as uuidv4 } from "uuid";
import PostModel from "../models/post.js";
import AnswerModel from "../models/answer.js";

export const CREATE_POST = async (req, res) => {
  try {
    const userId = req.userId; // from auth

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const title = req.body.title;
    const content = req.body.content;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPost = {
      id: uuidv4(),
      title,
      content,
      authorId: userId,
      answerIds: [],
      createdAt: new Date(),
    };

    const data = await new PostModel(newPost).save();

    return res.status(201).json({
      message: "Post created successfully",
      post: data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const xxx = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};
