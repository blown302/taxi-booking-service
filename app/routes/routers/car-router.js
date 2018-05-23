const {Router} = require('express');
const carRepository = require('../../repositories/car-repository');
const {getFactory} = require('../route-handlers/car-route-handler');

const router =  Router();

router.route('/')
  .get(getFactory(carRepository));

module.exports = router;