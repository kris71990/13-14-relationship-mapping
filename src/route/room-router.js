'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Room from '../model/rooms';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const roomRouter = new Router();

roomRouter.post('/api/rooms', jsonParser, (request, response, next) => {
  return new Room(request.body).save()
    .then((room) => {
      logger.log(logger.INFO, 'POST responding with 200');
      response.json(room);
    })
    .catch(next);
});

roomRouter.get('/api/rooms/:id', (request, response, next) => {
  return Room.findById(request.params.id)
    .then((room) => {
      if (!room) {
        logger.log(logger.INFO, 'GET error, no rooms found with this id');
        return next(new HttpErrors(404, 'no rooms found'));
      }
      logger.log(logger.INFO, 'GET success, responding with 200');
      return response.json(room);
    })
    .catch(next);
});

roomRouter.put('/api/rooms/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Room.findByIdAndUpdate(request.params.id, request.body, options)
    .then((room) => {
      if (!room) {
        return next(new HttpErrors(404, 'room not found'));
      }
      logger.log(logger.INFO, 'PUT responding with 200');
      return response.json(room);
    })
    .catch(next);
});

roomRouter.delete('/api/rooms/:id', (request, response, next) => {
  return Room.findByIdAndRemove(request.params.id)
    .then((room) => {
      if (!room) {
        logger.log(logger.INFO, 'DELETE error - no room found with this id');
        return next(new HttpErrors(404, 'room not found'));
      }
      logger.log(logger.INFO, 'DELETE request processed - 204 status');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default roomRouter;
