'use strict';

import faker from 'faker';
import Room from '../../model/rooms';
import { pCreateMockHouse, pRemoveMocks } from './house-mock';

const pCreateRoomMock = () => {
  const resultMock = {};

  return pCreateMockHouse()
    .then((house) => {
      resultMock.house = house;
      return new Room({
        type: faker.random.words(2),
        size: faker.random.number(),
        floor: faker.random.number(),
        house: house._id,
      }).save();
    })
    .then((room) => {
      resultMock.room = room;
      return resultMock;
    });
};

const pRemoveRoomMock = () => Promise.all([
  Room.remove({}),
  pRemoveMocks(),
]);

export { pCreateRoomMock, pRemoveRoomMock };
