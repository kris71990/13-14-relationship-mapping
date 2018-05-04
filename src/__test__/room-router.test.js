'use strict';

// import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateMockHouse } from './lib/house-mock';
import { pCreateRoomMock, pRemoveRoomMock } from './lib/room-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/rooms`;

describe('/api/rooms', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveRoomMock);

  describe('POST /api/rooms', () => {
    test('200 status code on creation', () => {
      return pCreateMockHouse()
        .then((house) => {
          const roomPost = {
            type: 'bedroom',
            size: 300,
            floor: 2,
            house: house._id,
          };
          return superagent.post(apiURL)
            .send(roomPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
  });

  describe('PUT /api/rooms', () => {
    test('200 status code on successful update', () => {
      let updatedRoom = null;
      return pCreateRoomMock()
        .then((mock) => {
          updatedRoom = mock.room;
          return superagent.put(`${apiURL}/${mock.room._id}`)
            .send({ floor: 1 });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.floor).toEqual(updatedRoom.floor);
        });
    });
  });
});
