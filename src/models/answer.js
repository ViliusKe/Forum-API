import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  postId: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export default mongoose.model("Answer", answerSchema);
