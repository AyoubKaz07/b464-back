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

export const userGQLSchema = gql`
    input userInput {
        name: String
        email: String
        wallet: Int
        phone: String
        pfp: String
        password: String
    }

    type User {
        _id: String
        name: String
        email: String
        wallet: Int
        phone: String
        pfp: String
    }

    type deleteResponse {
        success: Boolean
        message: String
    } 
    
    type Query {
        users: [User]
        user(id: String): User
    }
    type userAuth {
        user: User
        token: String
    }

    type Mutation {
        regUser(user: userInput): userAuth
        loginUser(email: String, password: String): userAuth
        updateUser(user: userInput,id:ID): User
        deleteUser(id: String): deleteResponse
    }

`