import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const startupSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  name: String,
  password: String,
  shortDesc: String,
  desc: String,
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
  founders: [{
    type: String,
    ref: "User"
  }],
  monitized: Boolean,
  video : {type : String, required: true},
},
{
  timestamps: true,
  conllection : "startups"
});

const StartupModel = mongoose.model("Startup", startupSchema);
export default StartupModel;