'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateMockHouse, pCreateManyMocks, pRemoveMocks } from './lib/house-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/house`;

describe('/api/house', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  // afterEach(() => House.remove({}));
  afterEach(pRemoveMocks);

  describe('POST api/house/:id', () => {
    test('POST - should respond with 200 status and posted information', () => {
      const testHouse = {
        type: 'townhouse',
        address: '111 Main Street', 
        size: 1500,
        built: 2012,
        worth: 500000,
      };
  
      return superagent.post(apiURL)
        .send(testHouse)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual(testHouse.type);
          expect(response.body.address).toEqual(testHouse.address);
          expect(response.body.built).toEqual(testHouse.built);
          expect(response.body.worth).toEqual(testHouse.worth);
          expect(response.body._id).toBeTruthy();
        });
    });

    test('POST - 409 for duplicate house', () => {
      return pCreateMockHouse()
        .then((house) => {
          const mockHouse2 = {
            type: house.type,
            address: house.address, 
            size: house.size,
            built: house.built,
            worth: house.worth,
          };
          return superagent.post(apiURL)
            .send(mockHouse2);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(409);
        });
    });
  
    test('POST - should respond with 400 status for error', () => {
      const testHouse = {
        type: faker.random.word(),
      };
      return superagent.post(apiURL)
        .send(testHouse)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
  
  describe('GET api/house/:id', () => {
    test('GET - should respond with 200 status and information', () => {
      let testHouse = null;
      return pCreateMockHouse()
        .then((house) => {
          testHouse = house;
          return superagent.get(`${apiURL}/${house._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual(testHouse.type);
          expect(response.body.address).toEqual(testHouse.address);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('GET - should respond with 404 error if car doesn\'t exist', () => {
      return superagent.get(`${apiURL}/blahblahblah`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  
  describe('DELETE api/house/:id', () => {
    test('DELETE - should respond with 204 status', () => {
      return pCreateMockHouse()
        .then((house) => {
          return superagent.delete(`${apiURL}/${house._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body._id).toBeFalsy();
        });
    });

    test('DELETE - should respond with 404 for id not found', () => { 
      return pCreateMockHouse()
        .then(() => {
          return superagent.delete(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  // 400 and 409
  describe('UPDATE api/house/:id', () => {
    test('PUT - should respond with 200 status and updated information', () => {
      let testHouse = null;
      return pCreateMockHouse()
        .then((house) => {
          testHouse = house;
          return superagent.put(`${apiURL}/${house._id}`)
            .send({ 
              type: 'condo', 
              address: '123 test', 
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual('condo');
          expect(response.body.address).toEqual('123 test');
          expect(response.body.built).toEqual(testHouse.built);
          expect(response.body.worth).toEqual(testHouse.worth);
          expect(response.body._id).toEqual(testHouse._id.toString());
        });
    });

    test('PUT - should respond with 404 for id not found', () => {
      return pCreateMockHouse()
        .then(() => {
          return superagent.put(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('PUT - should respond with 400 for validation error', () => {
      return pCreateMockHouse()
        .then((house) => {
          return superagent.put(`${apiURL}/${house._id}`)
            .send({ type: '' });
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });

    test('PUT - should respond with 409 for duplicate key', () => {
      return pCreateManyMocks(2)
        .then((houses) => {
          return superagent.put(`${apiURL}/${houses[0]._id}`)
            .send({ 
              address: houses[1].address,
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('Invalid route should route to catch-all', () => {
    test('should return 404', () => {
      return superagent.get(`${apiURL}invalid`)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

