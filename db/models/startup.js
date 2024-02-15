import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from "./user";

const startupSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  name: String,
  password: String,
  shortDescription: String,
  description: String,
  dateOfCreation: Date,
  email: String,
  phone: String,
  address: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  website: String,
  logo: String,
  founders: [UserModel.schema],
  monitized: { Boolean, default: false },
  video : {type : String, required: true},
});
const StartupModel = mongoose.model("Startup", startupSchema);
export default StartupModel;