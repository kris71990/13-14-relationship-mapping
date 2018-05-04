'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import House from '../model/house';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const houseRouter = new Router();

houseRouter.post('/api/house', jsonParser, (request, response, next) => {
  if (!request.body.type || !request.body.address || !request.body.built) {
    logger.log(logger.INFO, 'POST error, nothing to post');
    return next(new HttpErrors(400, 'data is incomplete, cannot post'));
  }

  return new House(request.body).save()
    .then((house) => {
      logger.log(logger.INFO, 'POST success, responding with 200');
      return response.json(house);
    })
    .catch(next);
});

houseRouter.get('/api/house/:id', (request, response, next) => {
  return House.findById(request.params.id)
    .then((house) => {
      if (!house) {
        logger.log(logger.INFO, 'GET error, no house found with this id');
        return next(new HttpErrors(404, 'house not found'));
      }
      logger.log(logger.INFO, 'GET success, responding with 200');
      return response.json(house);
    })
    .catch(next);
});

houseRouter.put('/api/house/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return House.findByIdAndUpdate(request.params.id, request.body, options)
    .then((house) => {
      if (!house) {
        logger.log(logger.INFO, 'GET error, no house found with this id');
        return next(new HttpErrors(404, 'house not found'));
      }
      logger.log(logger.INFO, 'PUT success, responding with 200');
      return response.json(house);
    })
    .catch(next);
});

houseRouter.delete('/api/house/:id', (request, response, next) => {
  return House.findByIdAndRemove(request.params.id)
    .then((house) => {
      if (!house) {
        logger.log(logger.INFO, 'DELETE error - no house found with this id');
        return next(new HttpErrors(404, 'house not found'));
      }
      logger.log(logger.INFO, 'DELETE request processed - 204 status');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default houseRouter;

