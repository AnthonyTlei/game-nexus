import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Game {
    id: Int!
    name: String!
    slug: String!
    genres: [String!]!
  }

  type Query {
    games: [Game!]!
  }
`;
