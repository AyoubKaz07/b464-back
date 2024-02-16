import startup from '../../models/startup.js';
import getMongooseSelectionFromSelectedFields from '../../utils/getFields.js';

export const startupResolvers = {
    Query: {
        startups: async (_, args, context, info) => {
            const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
            return await startup.find({}).select(mongooseSelection).lean();
        },
        startup: async (_, { id }, context, info) => {
            const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
            return await startup.findById(id).select(mongooseSelection).lean();
        },
    },
    Mutation: {
        createStartup: async (_, args) => {
            return await startup.create(args);
        },
        updateStartup: async (_, args) => {
            return await startup.findByIdAndUpdate(args.id, args, { new: true }).lean();
        },
        deleteStartup: async (_, args) => {
            return await startup.findByIdAndDelete(args.id).lean();
        },
    },
};