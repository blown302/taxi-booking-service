const assert = require('assert');
const sinon = require('sinon');

const World = require('../../app/data/world');
const TaxiBookingError = require('../../app/errors/TaxiBookingError');
const Car = require('../../app/data/car');

describe('world data tests', () => {
  let world;

  beforeEach(() => {
    world = new World();
    world.init();
  });

  describe('init should', () => {
    it('initialize 3 cars', (done) => {
      // Act performed in the before each.
      world.getAllCars().then(cars => {
        assert.equal(cars.length, 3);
        cars.forEach((car, i) => {
          assert.equal(car.id, i + 1);
        });
        done();
      });
    })
  });

  describe('getClosestCar should', () => {
    it('find closest car', (done) => {
      let closestCar;
      world.getAllCars().then(cars => {
        closestCar = cars[0];
        cars[0].location = {x: 2, y: -4};
        cars[1].location = {x: 3, y: 8};
        cars[2].location = {x:5, y: 20};
        return world.getClosestCar({x: 0, y: 0})
      }).then(car => {
        assert.equal(car.id, closestCar.id);
        done();
      }).catch(done);
    });
    it('find closest car with min id on tie', (done) => {
      world.availableCars.push(new Car(0));
      let closestCar;
      world.getAllCars().then(cars => {
        closestCar = cars[3];
        cars[0].location = {x: 2, y: -4};
        cars[1].location = {x: 3, y: 8};
        cars[2].location = {x:5, y: 20};
        cars[3].location = {x: 2, y: -4};
        return world.getClosestCar({x: 0, y: 0})
      }).then(car => {
        assert.equal(car.id, closestCar.id);
        done();
      }).catch(done);
    });
    it('reject given there are no available cars', (done) => {
      world.availableCars = [];
      world.getClosestCar({x: 0, y: 0})
      .then(_ => {
        assert.fail();
      }).catch(err => new Promise((resolve, reject) => {
        assert.equal(err.code, TaxiBookingError.Codes.ERR_NO_AVAILABLE_CARS);
        resolve();
        done();
      })).catch(done);
    });
    it('reject given available cars are null', (done) => {
      world.availableCars = null;
      world.getClosestCar({x: 0, y: 0})
      .then(_ => {
        assert.fail();
      }).catch(err => new Promise((resolve, reject) => {
        assert.equal(err.code, TaxiBookingError.Codes.ERR_NO_AVAILABLE_CARS);
        resolve();
        done();
      })).catch(done);
    });
  });

  describe('book should', () => {
    it('move available car to carsInUse', (done) => {
      const carId = 1;
      world.book(carId, {x:3, y:3}, {x:3, y:3}).then(_ => {
          assert.ok(!world.availableCars.some(c => c.id === carId));
          assert.ok(world.carsInUse.some(c => c.id === carId));
          assert.equal(world.availableCars.length, 2);
          assert.equal(world.carsInUse.length, 1);
          done();
      }).catch(done);
    });

    it('error if car id cannot be found', (done) => {
      const carId = 4;
      world.book(carId, {x:3, y:3}, {x:3, y:3}).then(_ => {
        assert.fail();
      }).catch(err => {
        assert.equal(err.code, TaxiBookingError.Codes.ERR_CAR_ID_CANNOT_BE_FOUND);
        done();
      }).catch(done);
    })

    it('set pickup and destination', (done) => {
      const carId = 1;
      world.book(carId, {x:4, y:4}, {x:3, y:3}).then(booking => {
        assert.deepEqual(booking.car.destination, {x:3, y:3});
        assert.deepEqual(booking.car.pickup, {x:4, y:4});
        done();
      }).catch(done);
    });

    it('set total time', (done) => {
      const carId = 1;
      world.book(carId, {x:4, y:4}, {x:3, y:3}).then(booking => {
        assert.equal(booking.time, 10);
        done();
      }).catch(done);
    })
  });

  describe('tick should', () => {
    let updateOperations;
    let bookingPromises;
    beforeEach(() => {
      bookingPromises = [];
      updateOperations = world.availableCars.map(car => sinon.stub(car, 'update'));
      // assert test is setup
      assert.ok(updateOperations);
      assert.equal(updateOperations.length, 3);
      const availableCarsInitialLength = world.availableCars.length;
      for (let id = 1; id < availableCarsInitialLength + 1; id++) {
        bookingPromises.push(world.book(id, {x:3, y:3}, {x:3, y:3}));
      }
    });

    it('update all cars', (done) => {
      Promise.all(bookingPromises)
        .then(bookings => {
          assert.equal(bookings.length, 3, 'setup: number of bookings should be 3');
          assert.equal(world.carsInUse.length, 3, 'setup: number of carsInUse should be 3')
        })
        .then(() => {
          return world.tick()
        })
        .then(() => {
          updateOperations.forEach(u => assert.ok(u.called));
          done();
        }).catch(done);
    });

    it('available car should be moved to available car', (done) => {
      Promise.all(bookingPromises)
        .then(bookings => {
          assert.equal(bookings.length, 3, 'setup: number of bookings should be 3');
          assert.equal(world.carsInUse.length, 3, 'setup: number of carsInUse should be 3');
          const toBeAvailableCar = world.carsInUse[0];
          updateOperations[0].callsFake(() => toBeAvailableCar.state = Car.States.available);
        })
        .then(() => {
          return world.tick()
        })
        .then(() => {
          assert.equal(world.availableCars.length, 1);
          assert.equal(world.carsInUse.length, 2);
          assert.equal(world.availableCars[0].id, 1);
          done();
        }).catch(done);
    });
  });


});