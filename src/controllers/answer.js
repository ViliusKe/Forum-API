import { v4 as uuidv4 } from "uuid";
import AnswerModel from "../models/answer.js";
import PostModel from "../models/post.js";
import UserModel from "../models/user.js";

export const CREATE_ANSWER = async (req, res) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.id;
    const content = req.body.content;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "Post ID and content are required" });
    }

    const post = await PostModel.findOne({ id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newAnswer = {
      id: uuidv4(),
      content,
      authorId: userId,
      postId,
      createdAt: new Date(),
    };

    const savedAnswer = await new AnswerModel(newAnswer).save();

    post.answerIds.push(savedAnswer.id);
    await post.save();

    // const user = await UserModel.findOne({ id: userId }).select("id userName");

    return res.status(201).json({
      message: "Answer submitted",
      answer: {
        ...savedAnswer._doc,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create answer" });
  }
};
