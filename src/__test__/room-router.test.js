'use strict';

import faker from 'faker';
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

    test('400 status code for error', () => {
      return pCreateMockHouse()
        .then((testHouse) => {
          const roomPost = {
            type: 'bathroom',
            house: testHouse._id,
          };
          return superagent.post(apiURL)
            .send(roomPost)
            .then(Promise.reject)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('409 for duplicate of unique room key', () => {
      return pCreateRoomMock()
        .then((testHouse) => {
          const mockRoom2 = {
            type: faker.random.words(2),
            size: testHouse.room.size,
            floor: faker.random.number(),
            house: testHouse.room.house,
          };
          return superagent.post(apiURL)
            .send(mockRoom2);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  });

  describe('GET api/rooms/:id', () => {
    test('200 status and information', () => {
      let testHouse = null;
      return pCreateRoomMock()
        .then((test) => {
          testHouse = test;
          return superagent.get(`${apiURL}/${test.room._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual(testHouse.room.type);
          expect(response.body.size).toEqual(testHouse.room.size);
          expect(response.body.house).toEqual(testHouse.house._id.toString());
        });
    });

    test('404 error if room doesn\'t exist', () => {
      return superagent.get(`${apiURL}/blahblahblah`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
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
          expect(response.body.floor).toEqual(1);
          expect(response.body.type).toEqual(updatedRoom.type);
        });
    });
  });

  describe('DELETE api/rooms/:id', () => {
    test('204 for successful deletion', () => {
      return pCreateRoomMock()
        .then((mock) => {
          return superagent.delete(`${apiURL}/${mock.room._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body._id).toBeFalsy();
        });
    });

    test('404 if room not found', () => { 
      return pCreateRoomMock()
        .then(() => {
          return superagent.delete(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
