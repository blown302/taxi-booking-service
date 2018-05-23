
exports.getFactory = (delegate) => (req, res, next) => {
    delegate.getAllCars().then(cars => res.json(
      cars.map(_carToResource))).catch(next);
  };


function _carToResource(car) {
  return {
    id: car.id,
    state: car.state,
    location: car.location,
    destination: car.destination,
    source: car.pickup
  }
}
