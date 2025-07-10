import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  postId: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  likes: { type: [String], default: [] }, // Array of user IDs
  dislikes: { type: [String], default: [] },
});

export default mongoose.model("Answer", answerSchema);
