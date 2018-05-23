const {Router} = require('express');
const tickRepository = require('../../repositories/tick-repository');
const {postFactory} = require('../route-handlers/tick-route-handler');

const router =  Router();

router.route('/')
  .post(postFactory(tickRepository));

module.exports = router;