import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";



const startupSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  name: String,
  password: String,
  shortDesc: String,
  desc: String,
  whyUs: [{title: String, desc: String}],
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
  logo: {type :String, default : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"},
  founders: [{
    type: String,
    ref: "User"
  }],
  monitized: Boolean,
  video : {type : String, required: false, default : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
},
{
  timestamps: true,
  conllection : "startups"
});
startupSchema.pre('save', async function (next) {
  const startup = this;

  if (!startup.isModified('password')) return next();

  try {

    const hashedPassword = await bcrypt.hash(startup.password, 10);

    startup.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

// Example method to compare passwords
startupSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};
const StartupModel = mongoose.model("Startup", startupSchema);
export default StartupModel;