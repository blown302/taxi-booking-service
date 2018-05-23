const assert = require('assert');
const Car = require('../../app/data/car');
describe('car data test', () => {
  let car;
  beforeEach(() => {
    car = new Car(1);
  });

  describe('set destination should', () => {
    it('updateDestination', () => {
      car.destination = {x: 2, y: 2};
      assert.deepStrictEqual(car.destination, {x: 2, y: 2})
    });
  });

  describe('update given inRoute state should', () => {
    it('move one place right given x coor not met and greater than position', () => {
      car.destination = {x: 2, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: 0})
    });
    it('move one place right given x coor not met and greater than position after 2 updates', () => {
      car.destination = {x: 3, y: 2};
      car.update();
      car.update();
      assert.deepStrictEqual(car.location, {x: 2, y: 0})
    });
    it('move one place left given x coor not met and less than position', () => {
      car.destination = {x: -2, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: -1, y: 0})
    });
    it('move one place up given y coor not met and greater than position', () => {
      car.destination = {x: 0, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: 1})
    });
    it('move two places up given y coor not met and greater than position after 2 updates', () => {
      car.destination = {x: 0, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: 1})
    });
    it('move one places right given x coor not met and y not met', () => {
      car.destination = {x: 2, y: 5};
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: 0})
    });
    it('move one place down given x coor not met and less than position', () => {
      car.destination = {x: 0, y: -2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: -1})
    });
    it('move right one and down one on two updates', () => {
      car.destination = {x: 1, y: -2};
      car.update();
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: -1})
    });
  });
  describe('update given pickup state should', () => {
    it('move one place right given x coor not met and greater than position', () => {
      car.pickup = {x: 2, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: 0})
    });
    it('move one place right given x coor not met and greater than position after 2 updates', () => {
      car.pickup = {x: 3, y: 2};
      car.update();
      car.update();
      assert.deepStrictEqual(car.location, {x: 2, y: 0})
    });
    it('move one place left given x coor not met and less than position', () => {
      car.pickup = {x: -2, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: -1, y: 0})
    });
    it('move one place up given y coor not met and greater than position', () => {
      car.pickup = {x: 0, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: 1})
    });
    it('move two places up given y coor not met and greater than position after 2 updates', () => {
      car.pickup = {x: 0, y: 2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: 1})
    });
    it('move one places right given x coor not met and y not met', () => {
      car.pickup = {x: 2, y: 5};
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: 0})
    });
    it('move one place down given x coor not met and less than position', () => {
      car.pickup = {x: 0, y: -2};
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: -1})
    });
    it('move right one and down one on two updates', () => {
      car.pickup = {x: 1, y: -2};
      car.update();
      car.update();
      assert.deepStrictEqual(car.location, {x: 1, y: -1})
    });
  });
  describe('during update state should', () => {
    it('given location and destination are equal set state to available.', () => {
      car.destination = {x: 0, y: 1};
      car.state = Car.States.inRoute;
      car.update();
      assert.equal(car.state, Car.States.available);
      assert.deepStrictEqual(car.location, {x: 0, y: 1});
    });
    it('given state is available do nothing.', () => {
      car.update();
      assert.deepStrictEqual(car.location, {x: 0, y: 0});
    });
    it('given set pickup location state should be pickup', () => {
      car.pickup = {x: 2, y: 2};
      assert.equal(car.state, Car.States.pickup);
    });
    it('given set destination location state should be inRoute', () => {
      car.destination = {x: 2, y: 2};
      assert.equal(car.state, Car.States.inRoute);
    });
    it('given set destination and pickup set should be pickup', () => {
      car.pickup = {x: -1, y: 13};
      car.destination = {x: 2, y: 2};
      assert.equal(car.state, Car.States.pickup);
    });
    it('given given pickup is matched should be inRoute', () => {
      car.pickup = {x: 0, y: 1};
      car.destination = {x: 2, y: 2};
      car.update();
      assert.equal(car.state, Car.States.inRoute);
    });
    it('set pickup is the same set inRoute', () => {
      car.pickup = {x: 0, y: 0};
      car.destination = {x: 2, y: 2};
      assert.equal(car.state, Car.States.inRoute);
    });
  });

});