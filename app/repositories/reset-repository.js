const {reset} = require('../providers/world-provider');

exports.reset = () => {
  reset();
  return Promise.resolve();
};