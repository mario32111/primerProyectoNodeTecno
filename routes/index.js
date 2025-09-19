const express = require('express');

const meserosRouter = require('./meseros.router');
const platillosRouter = require('./platillos.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router)
  router.use('/meseros', meserosRouter);
  router.use('/platillos', platillosRouter);

}

module.exports = routerApi;
