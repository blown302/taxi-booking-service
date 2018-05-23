const bookingSchema = require('../schemas/booking-schema');
const TaxiBookingError = require('../../errors/TaxiBookingError');

const Joi = require('joi');

exports.postFactory = (delegate) => (req, res, next) => {
    const {error} = Joi.validate(req.body, bookingSchema);
    if (error) return res.status(400).json(error);
    const {source, destination} = req.body;
    delegate.book(source, destination).then(booking => {
      res.status(201);
      res.json({car_id: booking.car.id, total_time: booking.time});
    }).catch(err => {
      if (err.code === TaxiBookingError.Codes.ERR_NO_AVAILABLE_CARS) return res.status(422).json(err);
      next(err);
    });
  };
