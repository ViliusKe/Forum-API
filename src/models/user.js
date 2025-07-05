import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
  savedPosts: { type: [String], required: true },
  creationDate: { type: Date, required: true },
});

export default mongoose.model("User", userSchema);
