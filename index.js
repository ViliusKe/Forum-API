import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./src/routes/user.js";
import postRouter from "./src/routes/post.js";

const app = express();

app.use(cors()); //add real URL to { origin: 'http://your-url.com' }

app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(console.log("Connected to DB!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/user", userRouter);

app.use("/posts", postRouter);

app.use((_req, res) => {
  return res.status(404).json({
    message: "This endpoint does not exist",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});
