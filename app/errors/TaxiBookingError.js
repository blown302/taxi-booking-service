class TaxiBookingError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

TaxiBookingError.Codes = {
  ERR_NO_AVAILABLE_CARS: 'ERR_NO_AVAILABLE_CARS',
  ERR_CAR_ID_CANNOT_BE_FOUND: 'ERR_CAR_ID_CANNOT_BE_FOUND'
};

module.exports = TaxiBookingError;