import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

export const REGISTER_USER = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: passwordHash,
      id: uuidv4(),
      savedPosts: [],
      creationDate: new Date(),
    };

    const data = await new UserModel(newUser).save();

    const token = jwt.sign(
      { userEmail: data.email, userId: data.id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    return res
      .status(201)
      .json({ message: "User created", user: data, jwt: token });
  } catch (err) {
    const DUPLICATE_ERROR_CODE = 11000;

    if (err.code === DUPLICATE_ERROR_CODE) {
      return res
        .status(409)
        .json({ message: "User with this email or user name already exist" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const LOGIN_USER = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({
      message: "Wrong email",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Wrong password",
    });
  }

  const token = jwt.sign(
    { userEmail: user.email, userId: user.id },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    message: "Logged in successfully",
    jwt: token,
  });
};
