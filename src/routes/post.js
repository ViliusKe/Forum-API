import express from "express";
import auth from "../middleware/auth.js";
import {
  CREATE_POST,
  GET_ALL_POSTS,
  GET_POST_WITH_ANSWERS,
  DELETE_POST,
} from "../controllers/post.js";
import { CREATE_ANSWER } from "../controllers/answer.js";

const router = express.Router();

router.post("/", auth, CREATE_POST);

router.get("/", GET_ALL_POSTS);

router.get("/:id", GET_POST_WITH_ANSWERS);

router.delete("/:id", auth, DELETE_POST);

router.post("/:id/answer", auth, CREATE_ANSWER);

export default router;
