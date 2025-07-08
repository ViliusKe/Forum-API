import express from "express";
import auth from "../middleware/auth.js";
import {
  CREATE_POST,
  GET_ALL_POSTS,
  GET_POST_WITH_ANSWERS,
} from "../controllers/post.js";

const router = express.Router();

router.post("/", auth, CREATE_POST);

router.get("/", GET_ALL_POSTS);

router.get("/:id", GET_POST_WITH_ANSWERS);

// router.post("/:id/answers", xxx);

export default router;
