import express from "express";
import validate from "../middleware/validation.js";
import { postSchema } from "../schemas/post.js";
import { answerSchema } from "../schemas/answer.js";
import auth from "../middleware/auth.js";
import {
  CREATE_POST,
  GET_ALL_POSTS,
  GET_POST_WITH_ANSWERS,
  DELETE_POST,
} from "../controllers/post.js";
import {
  CREATE_ANSWER,
  DELETE_ANSWER,
  LIKE_ANSWER,
  DISLIKE_ANSWER,
} from "../controllers/answer.js";

const router = express.Router();

router.post("/", auth, validate(postSchema), CREATE_POST);

router.get("/", GET_ALL_POSTS);

router.get("/:id", GET_POST_WITH_ANSWERS);

router.delete("/:id", auth, DELETE_POST);

router.post("/:id/answer", auth, validate(answerSchema), CREATE_ANSWER);

router.delete("/answers/:answerId", auth, DELETE_ANSWER);

router.put("/answers/:answerId/like", auth, LIKE_ANSWER);

router.put("/answers/:answerId/dislike", auth, DISLIKE_ANSWER);

export default router;
