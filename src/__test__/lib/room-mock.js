'use strict';

import faker from 'faker';
import Room from '../../model/rooms';
import { createMockHouse, createManyMocks, removeMocks } from './house-mock';

const createRoomMock = () => {
  const resultMock = {};

  return createMockHouse()
    .then((house) => {
      resultMock.house = house;
      return new Room({
        // card information just like house
      }).save();
    })
    .then((room) => {
      resultMock.room = room;
      return resultMock;
    });
};

const removeRoomMock = () => Promise.all([
  Room.remove({}),
  removeMocks(),
]);

export { createRoomMock, removeRoomMock };
