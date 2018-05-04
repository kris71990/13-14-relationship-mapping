'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import houseRoutes from '../route/house-router';
import roomRoutes from '../route/room-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

app.use(loggerMiddleware);
app.use(houseRoutes);
app.use(roomRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER - 404 error from catch-all route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server disconnected');
      });
    });
};

export { startServer, stopServer };
