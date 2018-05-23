const joi = require('joi');
MAX_NUMBER = 2147483647;
MIN_NUMBER = -2147483648;

const pointSchema = {
  x: joi.number().integer().min(MIN_NUMBER).max(MAX_NUMBER),
  y: joi.number().integer().min(MIN_NUMBER).max(MAX_NUMBER)
};

const bookingSchema = {
  source: pointSchema,
  destination: pointSchema
};

module.exports = bookingSchema;