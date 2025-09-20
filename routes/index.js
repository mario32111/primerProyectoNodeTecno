const express = require('express');

const meserosRouter = require('./meseros.router');
const platillosRouter = require('./platillos.router');
const ordenesRouter = require('./ordenes.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router)
  router.use('/meseros', meserosRouter);
  router.use('/platillos', platillosRouter);
  router.use('/ordenes', ordenesRouter);

}

module.exports = routerApi;
