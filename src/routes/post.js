import express from "express";
import auth from "../middleware/auth.js";
import { CREATE_POST } from "../controllers/post.js";

const router = express.Router();

router.post("/", auth, CREATE_POST);

router.post("/", xxx);

router.get("/:id", xxx);

router.post("/:id/answers", xxx);

export default router;
