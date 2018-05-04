'use strict';

import faker from 'faker';
import House from '../../model/house';

const pFakerMocks = () => {
  return new House({
    type: faker.random.word(),
    address: faker.address.streetAddress(),
    size: faker.random.number(),
    built: faker.random.number(),
    worth: faker.random.number(),
  }).save();
};

const pCreateMockHouse = () => {
  return new House({
    type: 'townhouse',
    address: '111 Main Street', 
    size: 1500,
    built: 2012,
    worth: 500000,
  }).save();
};

const pCreateManyMocks = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => pFakerMocks()));
};

const pRemoveMocks = () => House.remove({});

export { pCreateMockHouse, pCreateManyMocks, pRemoveMocks };
