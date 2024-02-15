import { userGQLSchema } from "./user.js"
import { mergeTypeDefs } from "@graphql-tools/merge"

export const mergedGQLSchema = mergeTypeDefs([userGQLSchema])