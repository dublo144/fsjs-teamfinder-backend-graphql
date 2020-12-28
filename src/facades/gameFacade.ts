import IPoint from '../interfaces/Point';
import { UserFacade } from './userFacade';
import PositionModel, { IPosition } from '../models/PositionModel';
import GameAreaModel, { IGameArea } from '../models/GameAreaModel';
import { IGameUser } from '../models/UserModel';

const debug = require('debug')('game-facade');

const nearbyPlayers = async (user: IGameUser, longitude: number, latitude: number, distance: number) => {
  const userLocation: IPoint = await updateUserLocation(user.userName, longitude, latitude);

  const nearbyPlayers = await PositionModel.find({
    location: {
      $near: {
        $geometry: userLocation,
        $maxDistance: distance
      }
    },
    userName: {
      $ne: user.userName
    }
  });

  return nearbyPlayers.map((player) => ({
    userName: player.userName,
    position: {
      latitude: player.location.coordinates[1],
      longitude: player.location.coordinates[0]
    }
  }));
};

const getUserGameAreas = async (longitude: number, latitude: number) => {
  const currentLocation: IPoint = { type: 'Point', coordinates: [longitude, latitude] };
  const gameAreas: Array<IGameArea> = await GameAreaModel.find({
    location: {
      $geoIntersects: {
        $geometry: currentLocation
      }
    }
  });
  return gameAreas;
};

const getAllGameAreasWithinRadius = async (
  longitude: number,
  latitude: number,
  radius: number
): Promise<Array<IGameArea>> => {
  const currentLocation: IPoint = { type: 'Point', coordinates: [longitude, latitude] };
  console.log(currentLocation);
  const gameAreas: Array<any> = await GameAreaModel.find({
    location: {
      $near: {
        $geometry: currentLocation,
        $maxDistance: radius
      }
    }
  });
  return gameAreas.map((area) => ({
    ...area._doc,
    coordinates: area.location.coordinates[0].map((coord: any) => ({ longitude: coord[0], latitude: coord[1] }))
  }));
};

const createGameArea = async () => {
  await GameAreaModel.remove({});
  await GameAreaModel.create({
    name: 'Frb. Have',
    location: {
      type: 'Polygon',
      coordinates: [
        [
          [12.517247200012207, 55.66963463190095],
          [12.52366304397583, 55.666560768293195],
          [12.530035972595215, 55.66781938730943],
          [12.531001567840576, 55.670881051090035],
          [12.518212795257568, 55.67194592146954],
          [12.517247200012207, 55.66963463190095]
        ]
      ]
    }
  });
  await GameAreaModel.create({
    name: 'Valby',
    location: {
      type: 'Polygon',
      coordinates: [
        [
          [12.507569789886475, 55.652997790860766],
          [12.506802678108215, 55.651971751996],
          [12.508508563041687, 55.65176896237154],
          [12.50915765762329, 55.652540768020664],
          [12.507569789886475, 55.652997790860766]
        ]
      ]
    }
  });
};

const updateUserLocation = async (userName: string, longitude: number, latitude: number): Promise<IPoint> => {
  const point: IPoint = { type: 'Point', coordinates: [longitude, latitude] };
  const now: Date = new Date();

  const filter = { userName };
  const update = { lastUpdated: now };
  const opts = { upsert: true, new: true };

  await PositionModel.findOneAndUpdate(filter, update, opts);

  return point;
};

export const GameFacade = {
  updateUserLocation,
  nearbyPlayers,
  getAllGameAreasWithinRadius,
  getUserGameAreas,
  createGameArea
};

// async function getPostIfReached(postId: string, lat: number, lon: number): Promise<any> {
//   try {
//     const post: IPost | null = await postCollection.findOne({
//       _id: postId,
//       location: {
//         $near: {}
//         // Todo: Complete this
//       }
//     });
//     if (post === null) {
//       throw new ApiError('Post not reached', 400);
//     }
//     return { postId: post._id, task: post.task.text, isUrl: post.task.isUrl };
//   } catch (err) {
//     throw err;
//   }
// }

// //You can use this if you like, to add new post's via the facade
// async function addPost(
//   name: string,
//   taskTxt: string,
//   isURL: boolean,
//   taskSolution: string,
//   lon: number,
//   lat: number
// ): Promise<IPost> {
//   const position = { type: 'Point', coordinates: [lon, lat] };
//   const status = await postCollection.insertOne({
//     _id: name,
//     task: { text: taskTxt, isURL },
//     taskSolution,
//     location: {
//       type: 'Point',
//       coordinates: [lon, lat]
//     }
//   });
//   const newPost: any = status.ops;
//   return newPost as IPost;
// }
