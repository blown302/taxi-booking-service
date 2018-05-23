const sinon = require('sinon');
const assert = require('assert');

const Booking = require('../../../app/data/models/Booking');
const Car = require('../../../app/data/car');
const TaxiBookingError = require('../../../app/errors/TaxiBookingError');
const {postFactory} = require('../../../app/routes/route-handlers/booking-route-handler');

describe('booking route handler tests', () => {
  let req, res, next, delegate, bookingCall;
  beforeEach(() => {
    req = {
      body: {
        source: {
          x: 1,
          y: 3
        },
        destination: {
          x:2,
          y: 2
        }
      }
    };

    res = {
      status: sinon.stub(),
      json: sinon.stub()
    };
    res.status.returns(res);
    delegate = {
      book: sinon.stub()
    };
    next = sinon.stub();
  });

  describe('good state and successful request should', () => {
    beforeEach(() => {
      bookingCall = Promise.resolve(new Booking(new Car(1), 10));
      delegate.book.returns(bookingCall);
    });
    it('return 201', (done) => {
      postFactory(delegate)(req, res);
      bookingCall.then(() => {
        assert.ok(res.status.calledWith(201));
        done();
      });
    });

    it('return 201 with max number', (done) => {
      req.body.destination.x = 2147483647;
      postFactory(delegate)(req, res, done);
      bookingCall.then(() => {
        assert.ok(res.status.calledWith(201));
        done();
      });
    });

    it('return 201 with min number', (done) => {
      req.body.destination.x = -2147483648;
      postFactory(delegate)(req, res);
      bookingCall.then(() => {
        assert.ok(res.status.calledWith(201));
        done();
      });
    });
    it('return 201 with good output', (done) => {
      postFactory(delegate)(req, res);
      bookingCall.then(() => {
        assert.ok(res.json.calledWith({car_id: 1, total_time: 10}));
        assert.ok(res.status.calledWith(201));
        done();
      });

    })

  });

  describe('bad state should error on', () => {
    it('destination y string return 400', () =>  {
      req.body.y = '';
      const spy = res.status.withArgs(400);
      postFactory(delegate)(req, res);
      assert.ok(spy.called);
      assert.ok(!delegate.book.called)
    });

    it('destination x string return 400', () =>  {
      req.body.x = '';
      const spy = res.status.withArgs(400);
      postFactory(delegate)(req, res);
      assert.ok(spy.called);
      assert.ok(!delegate.book.called)
    });

    it('source x string return 400', () =>  {
      req.body.x = '';
      const spy = res.status.withArgs(400);
      postFactory(delegate)(req, res);
      assert.ok(spy.called);
      assert.ok(!delegate.book.called)
    });

    it('source y string return 400', () =>  {
      req.body.y = '';
      const spy = res.status.withArgs(400);
      postFactory(delegate)(req, res);
      assert.ok(spy.called);
      assert.ok(!delegate.book.called)
    });

    it('source y over max return 400', () =>  {
      req.body.y = 2147483649;
      postFactory(delegate)(req, res);
      assert.ok(res.status.calledWith(400));
      assert.ok(!delegate.book.called)
    });

  });

  describe('given delegate.book returns an error it should', () => {
    beforeEach(() => {

    });

    it('return 422 when there there are no available cars', (done) => {
      bookingCall = Promise.reject(new TaxiBookingError('', TaxiBookingError.Codes.ERR_NO_AVAILABLE_CARS));
      delegate.book.returns(bookingCall);
      postFactory(delegate)(req, res);
      bookingCall
        .then(() => assert.fail())
        .catch(() => {
          assert.ok(res.status.calledWith(422));
          done();
        }).catch(done);
    });

    it('call next on general error', (done) => {
      const err = new Error();
      bookingCall = Promise.reject(err);
      delegate.book.returns(bookingCall);
      postFactory(delegate)(req, res, next);
      bookingCall
        .then(() => assert.fail())
        .catch(() => {
          assert.ok(next.calledWith(err));
          done();
        }).catch(done);
    });

  });


});