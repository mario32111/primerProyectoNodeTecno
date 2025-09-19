const express = require('express');

const meserosRouter = require('./meseros.router');


function routerApi (app){
  const router = express.Router();
  app.use('/api/v1', router)
  router.use('/meseros', meserosRouter);

}

module.exports = routerApi;
