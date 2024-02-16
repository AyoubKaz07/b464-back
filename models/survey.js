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
    user: {
      type: String,
      ref: "User",
    },
    response: Number,
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

    verification: { type: Boolean, default: false },
    answer: Number,
    responses: [responseSchema],
    choices : [String],
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
    fillers: [
      {
        type: String,
        ref: "User",
      },
    ],
    startup: {
      type: String,
      ref: "Startup",
    },
    video: { type: String, required: false },
    eta : Number,
    feedbacks: {
      question: String,
      answers: [
        {
          user: { type: String, ref: "User" },
          feedback: String,
          rating : Number,
        },
      ],
    },
    rating: Number,
  },
  {
    timestamps: true,
    collection: "surveys",
  }
);

export default mongoose.model("Survey", surveySchema);
