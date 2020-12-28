import { gql, AuthenticationError } from 'apollo-server-express';
import { GameFacade } from '../../../facades/gameFacade';

export const typeDefs = gql`
  extend type User {
    position: Position
  }

  type Position {
    longitude: Float!
    latitude: Float!
  }

  type GameArea {
    name: String!
    location: location!
    coordinates: [Position!]
  }

  type location {
    type: String!
    coordinates: [[[Float]]]
  }

  input SearchInput {
    longitude: Float!
    latitude: Float!
    radius: Int!
  }

  extend type Query {
    nearbyPlayers(input: SearchInput!): [User!]!
    getGameAreasWithinRadius(input: SearchInput!): [GameArea!]!
  }
`;

export const resolvers = {
  Query: {
    nearbyPlayers: async (_: any, { input }: any, { user }: any) => {
      if (!user) throw new AuthenticationError('Unauthenticated. Please sign in.');
      const { longitude, latitude, radius } = input;
      return await GameFacade.nearbyPlayers(user, longitude, latitude, radius);
    },
    getGameAreasWithinRadius: async (_: any, { input }: any, { user }: any) => {
      console.log(user);
      if (!user) throw new AuthenticationError('Unauthenticated. Please sign in.');
      const { longitude, latitude, radius } = input;
      return await GameFacade.getAllGameAreasWithinRadius(longitude, latitude, radius);
    }
  },
  Mutation: {}
};
