import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from "./user.js";
import StartupModel from "./startup.js";

const responseSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userId: {
      type: String,
      ref: "User",
    },
    response: String,
  },
  {
    timestamps: true,
  }
);

const questionSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    question: String,
    types: {
      enum: ["", "", ""],
    },
    verification : {type : Boolean, default : false},
    answer : Number,
    responses: [responseSchema],
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
    questions: [questionSchema],
    reward: Number,
    fillers: [{
      type: String,
      ref: "User"
    }],
    startup: {
      type: String,
      ref: "Startup",
    },
    video: { type: String, required: true },
    feedbackQst: { type: String, required: true },
  },
  {
    timestamps: true,
    collection : "surveys"
  }
);

export default mongoose.model("Survey", surveySchema);