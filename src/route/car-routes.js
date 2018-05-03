'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Car from '../model/car';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const carRouter = new Router();

carRouter.post('/api/car', jsonParser, (request, response, next) => {
  if (!request.body.make || !request.body.model || !request.body.year) {
    logger.log(logger.INFO, 'POST error, nothing to post');
    return next(new HttpErrors(400, 'data is incomplete, cannot post'));
  }

  return new Car(request.body).save()
    .then((car) => {
      logger.log(logger.INFO, 'POST success, responding with 200');
      return response.json(car);
    })
    .catch(next);
});

carRouter.get('/api/car/:id', (request, response, next) => {
  return Car.findById(request.params.id)
    .then((car) => {
      if (!car) {
        logger.log(logger.INFO, 'GET error, no car found with this id');
        return next(new HttpErrors(404, 'car not found'));
      }
      logger.log(logger.INFO, 'GET success, responding with 200');
      return response.json(car);
    })
    .catch(next);
});

carRouter.put('/api/car/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Car.findByIdAndUpdate(request.params.id, request.body, options)
    .then((car) => {
      if (!car) {
        logger.log(logger.INFO, 'GET error, no car found with this id');
        return next(new HttpErrors(404, 'car not found'));
      }
      logger.log(logger.INFO, 'PUT success, responding with 200');
      return response.json(car);
    })
    .catch(next);
});

carRouter.delete('/api/car/:id', (request, response, next) => {
  return Car.findByIdAndRemove(request.params.id)
    .then((car) => {
      if (!car) {
        logger.log(logger.INFO, 'DELETE error - no car found with this id');
        return next(new HttpErrors(404, 'car not found'));
      }
      logger.log(logger.INFO, 'DELETE request processed - 204 status');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default carRouter;

