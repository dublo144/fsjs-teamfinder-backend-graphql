import * as jwt from 'jsonwebtoken';
const { AuthenticationError } = require('apollo-server-express');

export const authenticationContextMiddleware = (context: any) => {
  if (context.connection) {
    context = context.connection.context;
  } else {
    if (context.req.headers.authorization) {
      const token = context.req.headers.authorization.split('Bearer ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET!, (err: any, decodedToken: any) => {
        if (err) throw new AuthenticationError('Invalid Token');
        context.user = decodedToken;
      });
    }
  }
  return context;
};
