import survey from "../../models/survey.js";
import weightDist from "../../utils/weightDist.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

async function ask_ai(msg) {
  const openai = new OpenAI({ apiKey: process.env.API_KEY });
  const data = await openai.chat.completions.create({
    messages: [{ role: "user", content: msg }],
    model: "gpt-3.5-turbo",
  });
  return data["choices"][0]["message"]["content"];
}

export const surveyResolvers = {
  Query: {
    surveys: async (_) => {
      try {
        const surveys = await survey.aggregate([
          {
            $project: {
              _id: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              startup: 1,
              video: 1,
              feedbacks: 1,
              questions: 1,
              fillers: 1,
              eta: 1,
              reward: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "fillers",
              foreignField: "_id",
              as: "fillers",
            },
            $lookup: {
              from: "startups",
              localField: "startup",
              foreignField: "_id",
              as: "startup",
            },
          },
        ]);
        for (let survey of surveys) {
          survey.startup = survey.startup[0];
        }
        return surveys;
      } catch (e) {
        throw new Error(e);
      }
    },
    survey: async (_, { id }) => {
      try {
        const surveys = await survey.aggregate([
          { $match: { _id: id } },
          {
            $project: {
              _id: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              startup: 1,
              video: 1,
              feedbackQst: 1,
              fillers: 1,
              questions: 1,
              eta: 1,
              reward: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "fillers",
              foreignField: "_id",
              as: "fillers",
            },
            $lookup: {
              from: "startups",
              localField: "startup",
              foreignField: "_id",
              as: "startup",
            },
          },
        ]);
        surveys[0].startup = surveys[0].startup[0];
        console.log(surveys[0]);
        return surveys[0];
      } catch (e) {
        throw new Error(e);
      }
    },
    surveysByStartup: async (_, { startup }) => {
      try {
        const surveys = await survey.aggregate([
          { $match: { startup } },
          {
            $project: {
              _id: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              startup: 1,
              video: 1,
              feedbackQst: 1,
              fillers: 1,
              eta: 1,
              reward: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "fillers",
              foreignField: "_id",
              as: "fillers",
            },
            $lookup: {
              from: "startups",
              localField: "startup",
              foreignField: "_id",
              as: "startup",
            },
          },
        ]);
        survey[0].startup = survey[0].startup[0];
        return surveys;
      } catch (e) {
        throw new Error(e);
      }
    },
    surveyReview: async (_, { id }) => {
      // for each question in the survey, get the sum of the weights of the responses
      try {
        const res = await survey.findById(id);
        console.log(res);
        let totalWeight = 0;
        for (let i = 0; i < res.questions.length; i++) {
          let weight = 0;
          const weights = weightDist(res.questions[i].choices);
          console.log(weights);
          res.questions[i].responses.forEach((r) => {
            weight += weights[r.response - 1];
          });
          console.log(weight);
          totalWeight += weight;
        }
        res.rating = Math.max(totalWeight, res.rating);
        return totalWeight;
      } catch (e) {
        throw new Error(e);
      }
    },
    askAi: async (_, { idea }) => {
      const ai_res = await ask_ai(`
        i want you to rate this startup idea, in less than 100 words. 
        this startup idea is for the muslim algrian market,
        consider various factors such as market demand, scalability, competition analysis, financial viability, and socio-cultural factors unique to Algeria. 7
        if possible provide examples of existing startups with a similar idea  
        the idea is "${idea}"`);
      return ai_res;
    },
    checkFeedback: async (_, { feedback }) => {
      const ai_res = await ask_ai(`
      this is a startup review    
      i want to check the given message, check if it does not contain inappropriate language or gibberish, the message is "${feedback}"
      output only 'true' or 'false' nothing more and nothing less
  `);
      ai_res = ai_res.toLowerCase();
      return ai_res == "true" ? true : false;
    },
  },
  Mutation: {
    createSurvey: async (_, args, { user }) => {
      if (user?.type != "startup") throw new Error("Unauthorized");
      try {
        console.log(args.survey.questions.length);
        let newSurvey = new survey({
          ...args.survey,
          feedbacks: {
            question: args.survey.feedbacksQst,
            answers: [
              {
                user: "",
                feedback: "",
                rating: 0,
              },
            ],
          },
          reward: args.survey.questions.length * 0.005,
          eta: args.survey.questions.length,
        });
        await newSurvey.save();
        newSurvey = await survey.aggregate([
          { $match: { _id: newSurvey._id } },
          {
            $project: {
              _id: 1,
              questions: 1,
              createdAt: 1,
              startup: 1,
              video: 1,
              feedbacks: 1,
              fillers: 1,
              reward: 1,
              eta: 1,
            },
          },

          {
            $lookup: {
              from: "startups",
              localField: "startup",
              foreignField: "_id",
              as: "startup",
            },
          },
        ]);
        console.log(newSurvey);
        newSurvey[0].startup = newSurvey[0].startup[0];

        return newSurvey[0];
      } catch (e) {
        throw new Error(e);
      }
    },
    updateSurvey: async (_, args, { user }) => {
      if (user?.type != "startup") throw new Error("Unauthorized");

      try {
        let updatedSurvey = await survey
          .findByIdAndUpdate(args.id, args.survey, { new: true })
          .lean();
        updatedSurvey = await survey.aggregate([
          { $match: { _id: updatedSurvey._id } },
          {
            $project: {
              _id: 1,
              questions: 1,
              createdAt: 1,
              startup: 1,
              video: 1,
              feedbacks: 1,
              fillers: 1,
              reward: 1,
              eta: 1,
            },
          },

          {
            $lookup: {
              from: "startups",
              localField: "startup",
              foreignField: "_id",
              as: "startup",
            },
          },
        ]);
        return updatedSurvey[0];
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteSurvey: async (_, args, { user }) => {
      if (user?.type != "startup") throw new Error("Unauthorized");

      try {
        await survey.findByIdAndDelete(args.id).lean();
        return {
          success: true,
          message: "Survey deleted successfully",
        };
      } catch (e) {
        throw new Error(e);
      }
    },
    addResponse: async (_, args, { user }) => {
      if (user?.type != "startup") throw new Error("Unauthorized");
      try {
        let res = await survey.findById(args.surveyId);
        if (res.startup != user.id) throw new Error("Unauthorized");
        let question = res.questions.find((q) => q.question === args.question);
        question.responses.push(args.response);
        await res.save();
        return res;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
