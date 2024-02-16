import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";


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
  { timestamps: true, collection: "users" }
);
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
