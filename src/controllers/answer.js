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

export const DELETE_ANSWER = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.body.userId;

    const answer = await AnswerModel.findOne({ id: answerId });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this answer" });
    }

    await AnswerModel.deleteOne({ id: answerId });

    await PostModel.updateOne(
      { id: answer.postId },
      { $pull: { answerIds: answerId } }
    );

    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error while deleting answer" });
  }
};

export const LIKE_ANSWER = async (req, res) => {
  try {
    const userId = req.body.userId;
    const answerId = req.params.answerId;

    const answer = await AnswerModel.findOne({ id: answerId });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.likes.includes(userId)) {
      answer.likes.pull(userId);
    } else {
      answer.dislikes.pull(userId);
      answer.likes.push(userId);
    }

    await answer.save();

    return res.status(200).json({
      message: "Vote updated",
      likes: answer.likes.length,
      dislikes: answer.dislikes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like answer" });
  }
};

export const DISLIKE_ANSWER = async (req, res) => {
  try {
    const userId = req.body.userId;
    const answerId = req.params.answerId;

    const answer = await AnswerModel.findOne({ id: answerId });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.dislikes.includes(userId)) {
      answer.dislikes.pull(userId);
    } else {
      answer.likes.pull(userId);
      answer.dislikes.push(userId);
    }

    await answer.save();

    return res.status(200).json({
      message: "Vote updated",
      likes: answer.likes.length,
      dislikes: answer.dislikes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to dislike answer" });
  }
};
