# Taxi Booking Service

Exercise for a taxi booking service. Tracks 3 taxis in a 2D grid.

## Run with Docker
`docker run -p 8080:8080 --rm -d --name taxi-service  blown302/taxi-booking-service`

## Run with node 8
Clone repository and run `npm i` to install dependencies. Then `npm start` to run the service.

## Run Tests with Docker
`docker run --rm --name taxi-service-test blown302/taxi-booking-service npm test`

## Run Tests with node 8
run `npm test` after installing dependencies.

## World

The size of the world is a 2D grid. Each car can move one unit for each time unit. 

The distance will be calculated in `Manhattan distance`.  

## Startup State

Initializes 3 cars by default but can configured to any number of cars. 
This will initialize the cars at the origin `(0, 0)`.

## Reset

Post to `/api/reset` to reset the world.

This will reset all cars data back to the initial state regardless of cars that are currently booked.

## Book

POST to `/api/book` to create a booking with payload:

```json
{
  "source": {
    "x": 12,
    "y": -2
  },
  "destination": {
    "x": 17,
    "y": 24
  }
}
```

Will return a 201 HTTP code with the following payload on successful booking:

```json
{
  "car_id": 1,
  "total_time": 36
}
```

If a car is not available it will return a `422 Unprocessable Entity` if a car is not available.

```json
{
    "code": "ERR_NO_AVAILABLE_CARS",
    "name": "TaxiBookingError"
}
```

## Tick

In order to advance time an endpoint has been provided to advance time one unit.

POST to `/api/tick`

## Cars Resource
GET `/api/cars`

Gets all cars in the current world. Good for seeing the status of the fleet.

## Postman Collection

Sample calls have been provided in the `postman` directory of this repo.
This collection can be imported to see sample calls.

## Actors

The actors behind the API are the World and the Cars. Cars know how to move and knows their own location and state.
The world knows which cars are in use and which are available.

Operations from the api are made to the world. The world will notify forward operations to the correct car.



