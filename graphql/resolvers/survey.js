import survey from "../../models/survey.js";
import getMongooseSelectionFromSelectedFields from "../../utils/getFields.js";

export const surveyResolvers = {
    Query: {
        surveys: async (root, args, context, info) => {
            const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
            return await survey.find({}).select(mongooseSelection).lean();
        },
        survey: async (_, { id }, context, info) => {
            const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
            return await survey.findById(id).select(mongooseSelection).lean();
        },
        surveysByStartup: async (_, { startup }, context, info) => {
            const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
            return await survey.find({ startup }).select(mongooseSelection).lean();
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