'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Car from '../model/car';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/car`;


const createMockCar = () => {
  return new Car({
    make: 'Honda',
    model: 'Civic', 
    year: 2012,
    color: 'silver',
  }).save();
};

// const fakerMocks = () => {
//   return new Car({
//     make: faker.random.word(),
//     model: faker.random.word(),
//     year: faker.random.number(),
//   }).save();
// };

// const createManyMocks = (howMany) => {
//   return Promise.all(new Array(howMany)
//     .fill(0)
//     .map(() => fakerMocks()));
// };

describe('/api/car', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Car.remove({}));

  describe('POST api/car/:id', () => {
    test('POST - should respond with 200 status and posted information', () => {
      const testCar = {
        make: 'Suburu',
        model: 'Forester', 
        year: 2009,
        color: 'orange',
      };
  
      return superagent.post(apiURL)
        .send(testCar)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.make).toEqual(testCar.make);
          expect(response.body.color).toEqual(testCar.color);
          expect(response.body.model).toEqual(testCar.model);
          expect(response.body.year).toEqual(testCar.year);
          expect(response.body._id).toBeTruthy();
        });
    });

    // test.only('POST - 409 for duplicate car', () => { // eslint-disable-line
    //   return createMockCar()
    //     .then((car) => {
    //       const mockCar2 = {
    //         make: car.make,
    //         model: car.model, 
    //         year: car.year,
    //         color: car.color,
    //       };
    //       return superagent.post(apiURL)
    //         .send(mockCar2);
    //     })
    //     .catch((error) => {
    //       expect(error.status).toEqual(409);
    //     });
    // });
  
    test('POST - should respond with 400 status for error', () => {
      const testCar = {
        make: faker.lorem.words(5),
      };
      return superagent.post(apiURL)
        .send(testCar)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
  
  describe('GET api/car/:id', () => {
    test('GET - should respond with 200 status and information', () => {
      let testCar = null;
      return createMockCar()
        .then((car) => {
          testCar = car;
          return superagent.get(`${apiURL}/${car._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.make).toEqual(testCar.make);
          expect(response.body.year).toEqual(testCar.year);
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
  
  describe('DELETE api/car/:id', () => {
    test('DELETE - should respond with 204 status', () => {
      return createMockCar()
        .then((car) => {
          return superagent.delete(`${apiURL}/${car._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body._id).toBeFalsy();
        });
    });

    test('DELETE - should respond with 404 for id not found', () => { 
      return createMockCar()
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
  describe('UPDATE api/car/:id', () => {
    test('PUT - should respond with 200 status and updated information', () => {
      let testCar = null;
      return createMockCar()
        .then((car) => {
          testCar = car;
          return superagent.put(`${apiURL}/${car._id}`)
            .send({ 
              make: 'Ford', 
              model: 'Focus', 
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.make).toEqual('Ford');
          expect(response.body.model).toEqual('Focus');
          expect(response.body.year).toEqual(testCar.year);
          expect(response.body._id).toEqual(testCar._id.toString());
        });
    });

    test('PUT - should respond with 404 for id not found', () => {
      return createMockCar()
        .then(() => {
          return superagent.put(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    // test.only('PUT - should respond with 400 for validation error', () => { // eslint-disable-line
    //   return createMockCar()
    //     .then((car) => {
    //       return superagent.put(`${apiURL}/${car._id}`)
    //         .send({ invalid: 'error' });
    //     })
    //     .catch((response) => {
    //       expect(response.status).toEqual(400);
    //     });
    // });

    // test('PUT - should respond with 409 for duplicate key', () => { // eslint-disable-line
    //   return createMockCar()
    //     .then((car) => {
    //       return superagent.put(`${apiURL}/${car._id}`)
    //         .send({ 
    //           make: 'Honda',
    //           model: 'Civic', 
    //           year: 2012,
    //           color: 'silver',
    //         });
    //     })
    //     .catch((response) => {
    //       expect(response.status).toEqual(409);
    //     });
    // });
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

