// import * as mongo from 'mongodb';
// import bcrypt from 'bcryptjs';
// const debug = require('debug')('test-users');
// const MongoClient = mongo.MongoClient;
// import { positionCreator } from './geoUtils';
// import { USER_COLLECTION_NAME, POSITION_COLLECTION_NAME, POST_COLLECTION_NAME } from '../config/collectionNames';
// import { getConnectedClient, closeConnection } from '../config/setupDB';

// (async function makeTestData() {
//   try {
//     const client = await getConnectedClient();
//     const db = client.db(process.env.DB_NAME);
//     const usersCollection = db.collection(USER_COLLECTION_NAME);
//     await usersCollection.deleteMany({});
//     await usersCollection.createIndex({ userName: 1 }, { unique: true });
//     const secretHashed = await bcrypt.hash('secret', 12);
//     const team1 = { name: 'Team1', userName: 't1', password: secretHashed, role: 'team' };
//     const team2 = { name: 'Team2', userName: 't2', password: secretHashed, role: 'team' };
//     const team3 = { name: 'Team3', userName: 't3', password: secretHashed, role: 'team' };

//     const status = await usersCollection.insertMany([team1, team2, team3]);

//     const positionsCollection = db.collection(POSITION_COLLECTION_NAME);
//     await positionsCollection.deleteMany({});
//     await positionsCollection.createIndex({ lastUpdated: 1 }, { expireAfterSeconds: 30 });
//     await positionsCollection.createIndex({ location: '2dsphere' });
//     const positions = [
//       positionCreator(12.48, 55.77, team1.userName, team1.name, true),
//       positionCreator(12.49, 55.77, team2.userName, team2.name, true),
//       positionCreator(12.5, 55.77, team3.userName, team3.name, true),
//       positionCreator(12.51, 55.77, 'xxx', 'yyy', false)
//     ];
//     const locations = await positionsCollection.insertMany(positions);

//     const postCollection = db.collection(POST_COLLECTION_NAME);
//     await postCollection.deleteMany({});
//     const posts = await postCollection.insertMany([
//       {
//         _id: 'Post1',
//         task: { text: '1+1', isUrl: false },
//         taskSolution: '2',
//         location: {
//           type: 'Point',
//           coordinates: [12.49, 55.77]
//         }
//       },
//       {
//         _id: 'Post2',
//         task: { text: '4-4', isUrl: false },
//         taskSolution: '0',
//         location: {
//           type: 'Point',
//           coordinates: [12.4955, 55.774]
//         }
//       }
//     ]);
//     debug(`Inserted ${posts.insertedCount} test Posts`);
//     debug(`Inserted ${status.insertedCount} test users`);
//     debug(`Inserted ${locations.insertedCount} test Location`);
//     debug(`NEVER, NEVER, NEVER run this on a production database`);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     closeConnection();
//   }
// })();
