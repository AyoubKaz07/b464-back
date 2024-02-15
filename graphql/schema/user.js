import { gql } from "apollo-server"

export const userGQLSchema = gql`
    type User {
        id: String!
        username: String!
        email: String!
    }

    type Product {
        id: String!
        name: String!
        price: Float!
    }

    type Query {
        users: usersInfoResponse!
        """
        Get a user by their unique ID.
        """
        user(id: String!): User!
    }

    type usersInfoResponse {
        success: Boolean!
        total: Int!
        users: [User!]!
    }

    type Mutation {
        regUser(username: String!, email: String!, password: String!): User!
        loginUser(email: String!, password: String!): User!
        updateUser(id: String!, username: String, email: String, password: String): User!
        deleteUser(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }
`