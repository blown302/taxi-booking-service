const {getCurrentWorld} = require('../providers/world-provider');

exports.tick = () => {
  const world = getCurrentWorld();
  return world.tick();
};