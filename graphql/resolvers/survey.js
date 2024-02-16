import survey from "../../models/survey.js";

export const surveyResolvers = {
    Query: {
        surveys: async (root, args, context, info) => {
        },
        survey: async (_, { id }, context, info) => {
        },
        surveysByStartup: async (_, { startup }, context, info) => {
        },
    },
    Mutation: {
        createSurvey: async (_, args) => {
            return await survey.create(args);
        },
        updateSurvey: async (_, args) => {
            return await survey.findByIdAndUpdate(args.id, args, { new: true }).lean();
        },
        deleteSurvey: async (_, args) => {
            return await survey.findByIdAndDelete(args.id).lean();
        },
    },
};