const {Router} = require('express');
const bookingRepository = require('../../repositories/booking-repository');
const {postFactory} = require('../route-handlers/booking-route-handler');

const router =  Router();

router.route('/')
  .post(postFactory(bookingRepository));

module.exports = router;