const {getCurrentWorld} = require('../providers/world-provider');

exports.getAllCars = () => {
  const world = getCurrentWorld();
  return world.getAllCars();
};