import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  answerIds: { type: [String], required: true },
  createdAt: { type: Date, required: true },
});

export default mongoose.model("Post", postSchema);
