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

export const startupGQLSchema =  gql`
    scalar Date

    type SocialMedia {
        facebook: String
        twitter: String
        linkedin: String
        instagram: String
    }
    
    type Founder {
        _id: String
        name: String
        email: String
        phone: String
        joinDate: Date
        createdAt: Date
    } 
    type deleteResponse {
        success: Boolean!
        message: String!
    }
    
    type Startup {
        _id: String
        name: String!
        password: String!
        shortDesc: String!
        desc: String!
        dateOfCreation: String!
        email: String!
        phone: String!
        address: String!
        socialMedia: SocialMedia
        website: String
        logo: String!
        founders: [Founder]!
        monitized: Boolean!
        video: String!
    }
    
    type Query {
        startup(id: String!): Startup
        startups: [Startup]
        # Add other queries as needed
    }
    
    type Mutation {
        createStartup(startup: StartupInput!): Startup
    
        updateStartup(startup: StartupInput!,id : ID!): Startup
    
        deleteStartup(id: ID!): deleteResponse
    }
    
    input SocialMediaInput {
        facebook: String
        twitter: String
        linkedin: String
        instagram: String
    }
    


    input StartupInput {
        name: String!
        password: String!
        shortDesc: String!
        desc: String!
        email: String!
        phone: String!
        address: String!
        socialMedia: SocialMediaInput
        website: String
        logo: String!
        founders: [String]!
        monitized: Boolean
        video: String!
        dateOfCreation: Date
    }
`