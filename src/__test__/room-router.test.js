'use strict';

import faker from 'faker';
import superagent from 'superagent';
import House from '../model/house';
import { startServer, stopServer } from '../lib/server';
import { createManyMocks, createMockHouse } from './lib/house-mock';
import { createRoomMock, removeRoomMock } from './lib/room-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/house`;

describe('/api/rooms', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeRoomMock);

  describe('POST /api/rooms', () => {
    test('200 status code on creation', () => {
      return createMockHouse()
        .then((house) => {
          const roomPost = {
            // information for room
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
      return createRoomMock()
        .then((mock) => {
          return superagent.put(`${apiURL}/${mock.card._id}`)
            .send({
              // send update information
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.status.bathrooms).toEqual(// uptdated info
        });
    });
  });
});
