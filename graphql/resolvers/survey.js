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
              feedbackQst: 1,
              fillers: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "founders",
              foreignField: "_id",
              as: "founders",
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
              localField: "founders",
              foreignField: "_id",
              as: "founders",
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
    surveysByStartup: async (_, { startup }, context, info) => {},
  },
  Mutation: {
    createSurvey: async (_, args) => {
      return await survey.create(args);
    },
    updateSurvey: async (_, args) => {
      return await survey
        .findByIdAndUpdate(args.id, args, { new: true })
        .lean();
    },
    deleteSurvey: async (_, args) => {
      return await survey.findByIdAndDelete(args.id).lean();
    },
  },
};
