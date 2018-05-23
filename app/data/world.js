const _ = require('lodash');
const {numberOfCars} = require('../config');
const Car = require('./car');
const TaxiBookingError = require('../errors/TaxiBookingError');
const Booking = require('../data/models/Booking');

/**
 * Represents a 2D grid world for cars to schedule pickups and routes.
 * Indices for the X and Y axis are 32bit integers.
 * @type {module.World}
 */
class World {
  constructor() {
    this.availableCars = [];
    this.carsInUse = [];
  }

  /**
   * Initializes the world with the cars at the origin of the grid.
   * Uses {@link numberOfCars} configuration to specify the number of cars to initialize in the world.
   */
  init() {
    for (let i = 1; i < numberOfCars + 1; i++) {
      this.availableCars.push(new Car(i));
    }
  }

  /**
   * Gets all of the cars in the this world.
   * This includes available and in use cars.
   * @returns {Promise<Car[]>}
   */
  getAllCars() {
    return Promise.resolve(this.availableCars.concat(this.carsInUse));
  }

  /**
   * gets closest {@link Car} to the point.
   * The promise will reject if no cars are available.
   * @param {Object} point <pre><code>{x: number, y: number}</code></pre>
   * @returns {Promise<Car>} The closest {@link Car} to the provided point.
   */
  getClosestCar(point) {
    return new Promise((resolve) => {
      if (!this.availableCars || !this.availableCars.length) {
        throw new TaxiBookingError('no available cars', TaxiBookingError.Codes.ERR_NO_AVAILABLE_CARS);
      }
      const min = this.availableCars.reduce((memo, c) => {
        const distance = _getDistence(c.location, point);
        if (memo.distance >  distance) {
          memo.distance = distance;
          memo.car = c;
        }
        else if (memo.distance === distance && memo.car.id > c.id) memo.car = c;
        return memo;
      }, {distance: Number.MAX_SAFE_INTEGER});

      resolve(min.car);
    })
  }

  /**
   * processes an advance of a time unit.
   * @returns {Promise} to notify caller operation is complete.
   */
  tick() {
    return new Promise((resolve) => {
      const initialInUseSize = this.carsInUse.length;

      const availableCars = [];
      this.carsInUse.forEach(c => {
        c.update();
        if (c.state === Car.States.available) {
          availableCars.push(c);
        }
      });

      availableCars.forEach(c => {
        const index = this.carsInUse.findIndex(ciu => c.id === ciu.id);
        this.carsInUse.splice(index, 1);
        this.availableCars.push(c);
      });
      resolve();
    });
  }

  /**
   * Book a trip for a rider with the specified car, pickup location and destination.
   * @param carId
   * @param pickup
   * @param destination
   * @returns {Promise<Booking>}
   */
  book(carId, pickup, destination) {
    return new Promise(resolve => {
      const index = this.availableCars.findIndex(c => c.id === carId);
      if (index === -1) {
        throw new TaxiBookingError(`Car ${carId} cannot be found`, TaxiBookingError.Codes.ERR_CAR_ID_CANNOT_BE_FOUND);
      }
      const car = this.availableCars.splice(index, 1)[0];
      car.destination = destination;
      car.pickup = pickup;
      this.carsInUse.push(car);
      resolve(new Booking(car, _getDistence(car.location, pickup) + _getDistence(pickup, destination)));
    });
  }
}

function _getDistence(start, end) {
  return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

module.exports = World;
