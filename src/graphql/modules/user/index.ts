import { gql, AuthenticationError } from 'apollo-server-express';
import { UserFacade } from '../../../facades/userFacade';
import { IGameUser } from '../../../models/UserModel';

const debug = require('debug')('userModule');

export const typeDefs = gql`
  type User {
    name: String
    userName: String!
    role: String
  }

  type AuthenticatedUser {
    name: String!
    userName: String!
    role: String!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    name: String!
    userName: String!
    password: String!
  }

  input UpdateUser {
    name: String
    userName: String
  }

  extend type Query {
    users: [User!]!
    user(username: String!): User!
    signIn(username: String!, password: String!): AuthenticatedUser!
  }

  extend type Mutation {
    createUser(UserInput: UserInput!): AuthenticatedUser!
    updateUser(UpdateUser: UpdateUser!): User!
    deleteUser(username: String!): User!
  }
`;

export const resolvers = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      try {
        const user: IGameUser = context.user;
        //if (!user) throw new AuthenticationError('Unauthenticated')
        const users = await UserFacade.getUsers();
        return users;
      } catch (error) {
        debug(error);
        throw error;
      }
    },
    user: async (_: any, { username }: any, { user }: any) => {
      try {
        //if (!user) throw new AuthenticationError('Unauthenticated')
        const userData = await UserFacade.getUser(username);
        return userData;
      } catch (error) {
        debug(error);
        throw error;
      }
    },
    signIn: async (_: any, { username, password }: any) => {
      return await UserFacade.authorizeUser(username, password);
    }
  },
  Mutation: {
    createUser: async (_: any, { UserInput }: any) => {
      return await UserFacade.addUser(UserInput);
    },
    updateUser: async (_: any, { UpdateUser }: any, { user }: any) => {
      return await UserFacade.updateUser(user, UpdateUser);
    },
    deleteUser: async (_: any, { username }: any) => {
      return await UserFacade.deleteUser(username);
    }
  }
};
