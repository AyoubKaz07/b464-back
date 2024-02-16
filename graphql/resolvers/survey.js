import survey from "../../models/survey.js";

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
              fillers: 1,
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
        console.log(surveys);
        return surveys;
      } catch (e) {
        throw new Error(e);
      }
    },
    survey: async (_, { id }) => {
      try {
        const surveys = await survey.aggregate([
          { $match: { $_id: id } },
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
        return surveys;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    createSurvey: async (_, args) => {
      try {
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
    updateSurvey: async (_, args) => {
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
    deleteSurvey: async (_, args) => {
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
  },
};
