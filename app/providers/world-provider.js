const World = require('../data/world');

let world = new World();
world.init();


exports.getCurrentWorld = () => world;

exports.reset = () => {
  world = new World();
  world.init();
};