const TaxiBookingError = require('../../errors/TaxiBookingError');

exports.postFactory = (delegate) => (req, res, next) => {
    delegate.tick().then(() => res.end()).catch(next);
  };
