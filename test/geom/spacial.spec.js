import U from '../test.utilities';
import { Point, Vector } from '../../src/geom';
import { Spacial } from '../../src/attributes/Shapes';

describe('Spacial', function () {
  // ** --- Utility Functions --- ** //
  describe('utilities', function () {
    U.assert(true);
  });
  // ** --- Translate Functions --- ** //
  describe('translation', function () {
    it('should set and get position correctly', function () {
      const spacial = new Spacial();
      const pos = new Point(12, 34);
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
      const reset = new Point.Zero();
      const spacial = new Spacial().position(reset);
      const vel = new Vector(U.rndBetween(-20, 20), U.rndBetween(-20, 20));
      spacial.shift(vel);
      U.assert(spacial.position().equals(vel.toPoint()), null, {
        msg: `${spacial.position()} equals ${vel.toPoint()}`,
      });
      spacial.position(reset);
      spacial.shift(vel.x, vel.y);
      U.assert(spacial.position().equals(vel.toPoint()), null, {
        msg: `${spacial.position()} equals ${vel.toPoint()}`,
      });
    });
    it('should translate position automatically correctly', function () {
      const reset = new Point.Zero();
      const spacial = new Spacial().position(reset).velocity(Vector.Zero());
      const vel = new Vector(U.rndBetween(-20, 20), U.rndBetween(-20, 20));
      spacial.velocity(vel);
      // Test velocity does not effect position while translatable is false
      spacial.translatable = false;
      spacial.run();
      U.assert(spacial.position().equals(reset), null, {
        msg: `${spacial.position()} equals ${reset}`,
      });
      // Test velocity does effect position while translatable is true
      spacial.translatable = true;
      spacial.run();
      U.assert(spacial.position().equals(vel.toPoint()), null, {
        msg: `${spacial.position()} equals ${vel.toPoint()}`,
      });
      // Test individual velocity axis
      spacial.position(reset);
      vel.x = U.rndBetween(-20, 20);
      vel.y = U.rndBetween(-20, 20);
      spacial.velocityX(vel.x);
      spacial.velocityY(vel.y);
      spacial.run();
      U.assert(spacial.position().equals(vel.toPoint()), null, {
        msg: `${spacial.position()} equals ${vel.toPoint()}`,
      });
    });
    it('should not translate position more than maxSpeed', function () {
      // intentionally overkill
      const vel = new Vector(1000, 1000);
      const maxSpeed = U.rndBetween(2, 10);
      const travel = Math.sqrt((maxSpeed * maxSpeed) / 2);
      const expected = new Point(travel, travel);
      const spacial = new Spacial({
        maxSpeed,
      })
        .position(Point.Zero())
        .velocity(vel);
      spacial.run();
      U.assert(spacial.position().distance(Point.Zero()), maxSpeed);
      U.assert(spacial.position().equals(expected, 10));
    });
    it('should not translate position less than minSpeed', function () {
      // intentionally underkill
      const vel = new Vector.One();
      const minSpeed = U.rndBetween(5, 15);
      const spacial = new Spacial({
        minSpeed,
      })
        .position(Point.Zero());
      // First test no velocity set (should default to right oriented vector by default)
      let expected = new Point(minSpeed, 0);
      spacial.run();
      U.assert(spacial.position().distance(Point.Zero()), minSpeed, { precision: 10 });
      U.assert(spacial.position().equals(expected, 10));
      // Then set velocity and set again
      spacial.position(Point.Zero());
      spacial.velocity(vel);
      const travel = Math.sqrt((minSpeed * minSpeed) / 2);
      expected = new Point(travel, travel);
      spacial.run();
      U.assert(spacial.position().distance(Point.Zero()), minSpeed, { precision: 10 });
      U.assert(spacial.position().equals(expected, 10));
    });
    it('should accelerate correctly', function () {
      const spacial = new Spacial().position(Point.Zero()).velocity(Vector.Zero());
      const acc = new Vector.One();
      const expected = new Vector.Zero();
      U.assert(spacial.velocity().equals(expected));
      spacial.accelerate(acc);
      expected.plusEquals(acc);
      U.assert(spacial.velocity().equals(expected));
      spacial.accelerate(acc);
      expected.plusEquals(acc);
      U.assert(spacial.velocity().equals(expected));
    });
  });
  // ** --- Rotate Functions --- ** //
  describe('rotation', function () {
    it('should set and get angle correctly', function () {
      const spacial = new Spacial().angle(0);
      const ang = U.rndBetween(1, 90);
      U.assert(spacial.angle(), 0);
      spacial.angle(ang);
      U.assert(spacial.angle(), ang);
    });
    it('should rotate angle manually correctly', function () {
      const reset = 0;
      const spacial = new Spacial().angle(reset);
      const ang = U.rndBetween(1, 90);
      spacial.rotate(ang);
      U.assert(spacial.angle(), ang);
      spacial.angle(reset);
      spacial.rotate(-ang);
      U.assert(spacial.angle(), 360 - ang);
    });
    it('should rotate angle automatically correctly', function () {
      const reset = 0;
      const spacial = new Spacial().angle(reset).rotation(0);
      const rot = U.rndBetween(1, 10);
      spacial.rotation(rot);
      // Test rotation does not effect angle while rotatable is false
      spacial.rotatable = false;
      spacial.run();
      U.assert(spacial.angle(), reset);
      // Test velocity does effect angle while rotatable is true
      spacial.rotatable = true;
      spacial.run();

      U.assert(spacial.angle(), rot);
      // Test negative rotation
      spacial.angle(reset);
      spacial.rotation(-rot);
      spacial.run();
      U.assert(spacial.angle(), 360 - rot);
    });
    it('should not rotate angle more than maxRotation', function () {
      // intentionally overkill
      const rot = 90;
      const maxRotation = U.rndBetween(2, 10);
      const spacial = new Spacial({
        maxRotation,
      })
        .angle(0)
        .rotation(rot);
      spacial.run();
      U.assert(spacial.angle(), maxRotation);
      spacial.angle(0);
      spacial.rotation(-rot);
      spacial.run();
      U.assert(spacial.angle(), 360 - maxRotation);
    });
    it('should not rotate angle less than minRotation', function () {
      // intentionally underkill
      const rot = 1;
      const minRotation = U.rndBetween(5, 15);
      const spacial = new Spacial({
        minRotation,
      })
        .angle(0)
        .rotation(rot);
      spacial.run();
      U.assert(spacial.angle(), minRotation);
      spacial.angle(0);
      spacial.rotation(-rot);
      spacial.run();
      U.assert(spacial.angle(), 360 - minRotation);
    });
    it('should accelerate rotation correctly', function () {
      const spacial = new Spacial().angle(0).rotation(0);
      const spin = 5;
      let expected = 0;
      U.assert(spacial.rotation(), expected);
      spacial.spin(spin);
      expected += spin;
      U.assert(spacial.rotation(), expected);
      spacial.spin(spin);
      expected += spin;
      U.assert(spacial.rotation(), expected);
    });
  });
  // ** --- Transform Functions --- ** //
  describe('transformation', function () {
    it('should set and get scale correctly', function () {
      const spacial = new Spacial();
      const scl = new Vector(12, 34);
      spacial.scale(12, 34);
      U.assert(spacial.scale().equals(scl));
      scl.x = U.rndBetween(1, 10);
      scl.y = U.rndBetween(1, 10);
      spacial.scale(scl);
      U.assert(spacial.scale().equals(scl));
      U.assert(spacial.scaleX(), scl.x);
      U.assert(spacial.scaleY(), scl.y);
      scl.x = U.rndBetween(1, 10);
      scl.y = U.rndBetween(1, 10);
      spacial.scaleX(scl.x);
      spacial.scaleY(scl.y);
      U.assert(spacial.scaleX(), scl.x);
      U.assert(spacial.scaleY(), scl.y);
    });
    it('should dilate scale manually correctly', function () {
      const reset = new Vector.Zero();
      const spacial = new Spacial().scale(reset);
      const scl = new Vector(U.rndBetween(1, 5), U.rndBetween(1, 5));
      spacial.dilate(scl);
      U.assert(spacial.scale().equals(scl));
      spacial.scale(reset);
      spacial.dilate(scl.x, scl.y);
      U.assert(spacial.scale().equals(scl));
    });
    it('should dilate scale automatically correctly', function () {
      const reset = new Vector.Zero();
      const spacial = new Spacial().scale(reset).dilation(Vector.Zero());
      const scl = new Vector(U.rndBetween(1, 5), U.rndBetween(1, 5));
      spacial.dilation(scl);
      // Test velocity does not effect position while dynamic is false
      spacial.scalable = false;
      spacial.run();
      U.assert(spacial.scale().equals(reset), null, {
        msg: `${spacial.scale()} equals ${reset}`,
      });
      // Test velocity does effect position while dynamic is true
      spacial.scalable = true;
      spacial.run();
      U.assert(spacial.scale().equals(scl), null, {
        msg: `${spacial.scale()} equals ${scl}`,
      });
      // Test individual velocity axis
      spacial.scale(reset);
      scl.x = U.rndBetween(1, 5);
      scl.y = U.rndBetween(1, 5);
      spacial.dilationX(scl.x);
      spacial.dilationY(scl.y);
      spacial.run();
      U.assert(spacial.scale().equals(scl), null, {
        msg: `${spacial.scale()} equals ${scl}`,
      });
    });
    it('should not dilate more than maxSize', function () {
      // intentionally overkill
      const scl = new Vector(1000, 1000);
      const maxSize = U.rndBetween(2, 10);
      const spacial = new Spacial({
        maxSize,
      })
        .scale(Vector.One())
        .dilation(scl);
      spacial.dynamic = true;
      spacial.run();
      U.assert(spacial.scale().equals(new Vector(maxSize, maxSize)));
    });
    it('should not dilate less than minSize', function () {
      // intentionally underkill
      const minSize = U.rndBetween(3, 8);
      const spacial = new Spacial({
        minSize,
      })
        .scale(Vector.One());
      U.assert(spacial.scale().equals(new Vector(minSize, minSize)));
    });
    it('should accelerate dilation correctly', function () {
      const spacial = new Spacial().scale(Vector.Zero()).dilation(Vector.Zero());
      const acc = new Vector.One();
      const expected = new Vector.Zero();
      U.assert(spacial.dilation().equals(expected));
      spacial.stretch(acc);
      expected.plusEquals(acc);
      U.assert(spacial.dilation().equals(expected));
      spacial.stretch(acc);
      expected.plusEquals(acc);
      U.assert(spacial.dilation().equals(expected));
    });
  });
});
