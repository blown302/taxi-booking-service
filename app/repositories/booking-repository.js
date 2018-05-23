const {getCurrentWorld} = require('../providers/world-provider');

exports.book = (pickup, destination) => {
  const world = getCurrentWorld();
  return world.getClosestCar(pickup).then(car => {
    return world.book(car.id, pickup, destination);
  });
};