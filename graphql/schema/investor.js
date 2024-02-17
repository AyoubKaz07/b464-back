import { gql } from "apollo-server";

export const investorGQLSchema = gql`
    type Investor {
        _id: String
        name: String
        email: String
        phone: String
    },
    input InvestorInput {
        name: String!
        email: String!
        phone: String!
    }
    type Mutation {
        createInvestor(investor: InvestorInput): Investor
    }
    

`