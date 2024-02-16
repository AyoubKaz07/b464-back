import { userResolvers } from './user.js';
import { surveyResolvers } from './survey.js';
import { startupResolvers } from './startup.js';

export const resolvers = [userResolvers, surveyResolvers, startupResolvers]