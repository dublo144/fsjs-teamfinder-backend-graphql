import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { ApiError } from './errors/apiError';
import { userAPIRouter, gameAPIRouter, geoApiRouter } from './routes';
import authenticateToken from './middlewares/authMiddleware';
import { requestLogger } from './middlewares/logger';

import { ApolloServer } from 'apollo-server-express';
import { authenticationContextMiddleware } from './middlewares/authContextMiddleware';
import http from 'http';

const server = new ApolloServer({
  modules: [require('./graphql/modules/user'), require('./graphql/modules/game')],
  subscriptions: {
    // onConnect: (connectionParams) => {
    //   if (connectionParams.Authorization) {
    //     const token = connectionParams.Authorization.split('Bearer ')[1];
    //     return jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    //       if (err) throw new AuthenticationError('Invalid Token');
    //       return {
    //         user: decodedToken
    //       };
    //     });
    //   } else {
    //     throw new AuthenticationError('Not authenticated');
    //   }
    // }
  },
  context: authenticationContextMiddleware
});

const app: any = express();

app.use(authenticateToken);

app.use(express.static(path.join(process.cwd(), 'public')));

// Add if needed
app.use(requestLogger);
// app.use(errorLogger)

app.use(express.json());

app.get('/api/dummy', (req: any, res: any) => {
  res.json({ msg: 'Hello' });
});

app.use('/api/users', userAPIRouter);
app.use('/gameapi', gameAPIRouter);
app.use('/geoapi', geoApiRouter);

app.use(function (err: any, req: any, res: any, next: Function) {
  if (err instanceof ApiError) {
    const e = <ApiError>err;
    return res.status(e.errorCode).send({ code: e.errorCode, message: e.message });
  }
  next(err);
});

server.applyMiddleware({
  app,
  cors: {
    origin: new RegExp('/*/'),
    credentials: true
  }
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 3333;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0-wabpp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() =>
    httpServer.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
      console.log(`🚀 SubscriptionServer ready at http://localhost:4000${server.subscriptionsPath}`);
    })
  )
  .catch((e) => console.log(e));

//export const server = app;
