import { v4 as uuidv4 } from "uuid";
import PostModel from "../models/post.js";
import AnswerModel from "../models/answer.js";
import UserModel from "../models/user.js";

export const CREATE_POST = async (req, res) => {
  try {
    const userId = req.body.userId;

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

export const GET_ALL_POSTS = async (req, res) => {
  try {
    const filter =
      req.query.filter === "answered"
        ? { answerIds: { $ne: [] } }
        : req.query.filter === "unanswered"
        ? { answerIds: { $eq: [] } }
        : {};

    const posts = await PostModel.find(filter).sort({ createdAt: -1 });

    const authorIds = posts.map((post) => post.authorId);
    const authors = await UserModel.find({ id: { $in: authorIds } }).select(
      "id userName"
    );

    const postsWithAuthor = posts.map((post) => {
      const author = authors.find((user) => user.id === post.authorId);
      return {
        ...post._doc,
        author: author
          ? {
              id: author.id,
              userName: author.userName,
            }
          : null,
      };
    });

    return res.status(200).json({ posts: postsWithAuthor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const GET_POST_WITH_ANSWERS = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOne({ id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postAuthor = await UserModel.findOne({ id: post.authorId }).select(
      "id userName"
    );

    const answers = await AnswerModel.find({ postId });

    const answerAuthorIds = [...new Set(answers.map((a) => a.authorId))];

    const answerAuthors = await UserModel.find({
      id: { $in: answerAuthorIds },
    }).select("id userName");

    const answersWithAuthorInfo = answers.map((answer) => {
      const author = answerAuthors.find((user) => user.id === answer.authorId);
      return {
        ...answer._doc,
        author: author ? { id: author.id, userName: author.userName } : null,
      };
    });

    return res.status(200).json({
      post: {
        ...post._doc,
        author: postAuthor
          ? { id: postAuthor.id, userName: postAuthor.userName }
          : null,
        answers: answersWithAuthorInfo,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const DELETE_POST = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    const post = await PostModel.findOne({ id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await PostModel.deleteOne({ id: postId });

    await AnswerModel.deleteMany({ postId });

    return res
      .status(200)
      .json({ message: "Post and its answers deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
