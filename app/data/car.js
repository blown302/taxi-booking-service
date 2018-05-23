const _ = require('lodash');

/**
 * represents a car as an actor in a world.
 * @type {Car}
 */
class Car {
  constructor(id) {
    this.id = id;
    this.location = {x: 0, y: 0};
    this.state = Car.States.available;
    this.stateMapping = {
      [Car.States.available]: () => {},
      [Car.States.inRoute]: _moveOperation(() => this.destination, () => this.location, () => {
        this.destination = undefined;
        this.state = Car.States.available;
      }),
      [Car.States.pickup]: _moveOperation(() => this.pickup, () => this.location, () => {
        this.pickup = undefined;
        this.state = Car.States.inRoute
      })
    }
  }

  get destination() {
    return this._destination;
  }

  set destination(newDestination) {
    this._destination = newDestination;
    if (this.state === Car.States.available) {
      this.state = Car.States.inRoute;
    }
  }

  get pickup() {
    return this._pickup;
  }

  set pickup(newPickup) {
    if (_.isEqual(newPickup, this.location)) {
      return this.state = Car.States.inRoute;
    }
    this._pickup = newPickup;
    this.state = Car.States.pickup
  }

  /**
   * Updates the car for one time unit and returns state.
   * Update will modify it's behavior depending on state.
   * NOTE: only will return values in constant {@link Car.States}.
   * @returns {string} of it's current state after update.
   */
  update() {
    this.stateMapping[this.state]();
  }
}

function _moveOperation(destinationAccessor, locationAccessor, stateSetter) {
  return () => {
    const destination = destinationAccessor();
    const location = locationAccessor();
    const xDiff = _getIncrement(destination.x, location.x);
    if (xDiff) {
      location.x += xDiff;
    } else {
      location.y += _getIncrement(destination.y, location.y);
    }

    if (_.isEqual(location, destination)) {
      stateSetter();
    }
  }
}

function _getIncrement(dest, current) {
  const diff = dest - current;
  return (diff / Math.abs(diff));
}

Car.States = {
  available: 'Available',
  pickup: 'Pickup',
  inRoute: 'InRoute'
};

module.exports = Car;