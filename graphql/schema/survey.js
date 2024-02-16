import { gql } from "apollo-server"
import { GraphQLScalarType, Kind } from "graphql"

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});



export const surveyGQLSchema = gql`

    type response {
        id: ID!
        user: User!
        response: Int!
        createdAt: Date!
    }

    input responseInput {
        user: String!
        response: Int!
    }

    type question {
        id: ID!
        question: String!
        verification: Boolean!
        answer: Int
        responses: [response]
        choices: [String]!
    }

    input questionInput {
        question: String!
        verification: Boolean!
        answer: Int
        choices: [String]!
    }

    input surveyInput {
        questions: [questionInput]!
        startup: ID!
        video: String!
        feedbacksQst : String!
    }
    type feedbackAnswer {
        user : String
        feedback : String
        rating : Int
    }
    type feedbacks {
        question : String!
        answers : [feedbackAnswer]
    }
    type Survey {
        id: ID!
        questions: [question],
        reward: Int!
        fillers: [User]
        startup: Startup
        video: String
        feedbacks: feedbacks!
        createdAt: Date!
        eta : Int
    }

    type Query {
        surveys: [Survey!]!
        survey(id: String!): Survey!
        surveysByStartup(startup: String!): [Survey!]!
    }

    type Mutation {
        createSurvey(survey: surveyInput): Survey
        updateSurvey(survey: surveyInput): Survey
        deleteSurvey(id: ID!): Survey
    }
`