const {Router} = require('express');
const resetRepository = require('../../repositories/reset-repository');
const {postFactory} = require('../route-handlers/reset-route-handler');

const router =  Router();

router.route('/')
  .post(postFactory(resetRepository));

module.exports = router;