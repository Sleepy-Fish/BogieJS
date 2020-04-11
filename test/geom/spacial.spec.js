const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;

const U = require('../test.utilities').default;
const Geom = require('../../src/geom');
const Spacial = require('../../src/geom/Spacial').default;

describe('Spacial', function () {
  // ** --- Utility Functions --- ** //
  describe('utilities', function () {
    U.assert(true);
  });
  // ** --- Translate Functions --- ** //
  describe('translation', function () {
    it('should set and get position correctly', function () {
      const spacial = new Spacial();
      const pos = new Geom.Point(12, 34);
      spacial.position(12, 34);
      U.assert(spacial.position().equals(pos));
      pos.x = U.rndBetween(1, 100);
      pos.y = U.rndBetween(1, 100);
      spacial.position(pos);
      U.assert(spacial.position().equals(pos));
      U.assert(spacial.x(), pos.x);
      U.assert(spacial.y(), pos.y);
      pos.x = U.rndBetween(1, 100);
      pos.y = U.rndBetween(1, 100);
      spacial.x(pos.x);
      spacial.y(pos.y);
      U.assert(spacial.x(), pos.x);
      U.assert(spacial.y(), pos.y);
    });
    it('should translate position manually correctly', function () {
      const reset = new Geom.Point.Zero();
      const spacial = new Spacial().position(reset);
      // const vel = new Geom.Vector(U.rndBetween(-20, 20), U.rndBetween(-20, 20));
      const vel = new Geom.Vector(0, 1);
      spacial.shift(vel);
      U.assert(spacial.position().equals(vel.toPoint()));
      spacial.position(reset);
      spacial.shift(vel.x, vel.y);
      U.assert(spacial.position().equals(vel.toPoint()));
    });
    it('should translate position automatically correctly', function () {
      const reset = new Geom.Point.Zero();
      const spacial = new Spacial().position(reset).velocity(Geom.Vector.Zero());
      const vel = new Geom.Vector(U.rndBetween(-20, 20), 0);
      spacial.velocity(vel);
      // Test velocity does not effect position while dynamic is false
      spacial.dynamic = false;
      spacial.run();
      U.assert(spacial.position().equals(reset));
      // Test velocity does effect position while dynamic is true
      spacial.dynamic = true;
      spacial.run();
      U.assert(spacial.position().equals(vel.toPoint()));
      // Test individual velocity axis
      spacial.position(reset);
      vel.x = U.rndBetween(-20, 20);
      vel.y = U.rndBetween(-20, 20);
      spacial.velocityX(vel.x);
      spacial.velocityY(vel.y);
      spacial.run();
      U.assert(spacial.position().equals(vel.toPoint()));
    });
    it('should not translate position more than maxSpeed', function () {
      // intentionally overkill
      const vel = new Geom.Vector(1000, 1000);
      const maxSpeed = U.rndBetween(2, 10);
      const travel = Math.sqrt((maxSpeed * maxSpeed) / 2);
      const expected = new Geom.Point(travel, travel);
      const spacial = new Spacial(null, {
        maxSpeed
      })
        .position(Geom.Point.Zero())
        .velocity(vel);
      spacial.dynamic = true;
      spacial.run();
      U.assert(spacial.position().distance(Geom.Point.Zero()), maxSpeed, { precision: 10 });
      U.assert(spacial.position().equals(expected, 10));
    });

    it('should not translate position less than minSpeed', function () {
      U.assert(true);
    });
  });
  // ** --- Rotate Functions --- ** //
  describe('rotation', function () {
    U.assert(true);
  });
  // ** --- Transform Functions --- ** //
  describe('transformation', function () {
    U.assert(true);
  });
});
