import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    wallet: Number,
    phone: String,
    pfp: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
