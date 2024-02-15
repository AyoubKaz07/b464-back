import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from "./user";
import StartupModel from "./startup";

const questionsSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    question: String,
    type: String,
    options: [String],
    required: Boolean,
    verification : {type : Boolean, default : false},
    response : Number,
  },
  {
    timestamps: true,
  }
);
const surveySchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    questions: [questionsSchema],
    reward: Number,
    fillers: [UserModel.schema],
    startup: StartupModel.schema,
    video: { type: String, required: true },
    feedback: { type: String, required: true },
    rating : {type : Number, required: true},

  },
  {
    timestamps: true,
  }
);
