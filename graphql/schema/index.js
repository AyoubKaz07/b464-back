import { userGQLSchema } from "./user.js"
import { surveyGQLSchema } from "./survey.js"
import { startupGQLSchema } from "./startup.js"
import { investorGQLSchema } from "./investor.js"
import { mergeTypeDefs } from "@graphql-tools/merge"

export const mergedGQLSchema = mergeTypeDefs([userGQLSchema, surveyGQLSchema, startupGQLSchema,investorGQLSchema])