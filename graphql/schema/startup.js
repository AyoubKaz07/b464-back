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
    


    type deleteResponse {
        success: Boolean
        message: String
    }
    type whyUs {
        title: String
        desc: String
    }
    type Startup {
        _id: String
        name: String
        whyUs: [whyUs]
        password: String
        shortDesc: String
        desc: String
        dateOfCreation: String
        email: String
        phone: String
        address: String
        socialMedia: SocialMedia
        website: String
        logo: String
        founders: [User]
        monitized: Boolean
        video: String
    }
    
    type Query {
        startup(id: ID): Startup
        startups: [Startup]
    }
    type startupAuth {
        startup: Startup
        token: String
    }
    
    type Mutation {
        createStartup(startup: StartupInput): startupAuth
        updateStartup(startup: StartupInput,id : ID): Startup
        deleteStartup(id: ID): deleteResponse
        loginStartup(email: String, password: String): startupAuth
    }
    
    input SocialMediaInput {
        facebook: String
        twitter: String
        linkedin: String
        instagram: String
    }

    type message {
        success: Boolean
        message: String
    }
    input whyUsInput {
        title: String
        desc: String
    }
    input StartupInput {
        name: String
        password: String
        shortDesc: String
        desc: String
        email: String
        phone: String
        address: String
        socialMedia: SocialMediaInput
        website: String
        logo: String
        founders: [String]
        monitized: Boolean
        video: String
        dateOfCreation: Date
        whyUs: [whyUsInput]
    }
`