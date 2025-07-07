import express from "express";
import { REGISTER_USER, LOGIN_USER } from "../controllers/user.js";
import loginSchema from "../schemas/login.js";
import validate from "../middleware/validation.js";

const router = express.Router();

router.post("/", REGISTER_USER);

router.post("/login", validate(loginSchema), LOGIN_USER);

export default router;
