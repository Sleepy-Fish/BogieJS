import U from '../test.utilities';
import { Vector } from '../../src/geom';

describe('Vector', function () {
  // ** --- Vector Property Getters / Setters --- ** //
  describe('vector properties', function () {
    it('should get and set radian directions correctly', function () {
      const vector = Vector.One();
      const expected = Math.atan2(2, 2);
      U.assert(vector.direction(), expected);
      vector.direction(0.25);
      U.assert(vector.direction(), 0.25);
    });
    it('should get and set degree angles correctly', function () {
      const vector = Vector.One();
      const expected = 45;
      U.assert(vector.angle(), expected);
      vector.angle(90);
      U.assert(vector.angle(), 90);
    });
    it('should get and set magnitude correctly', function () {
      const vector = Vector.One();
      const expected = Math.sqrt(2);
      U.assert(vector.magnitude(), expected);
    });
  });
  // ** --- Vector Arithmatic Functions --- ** //
  describe('vector arithmatic', function () {
    it('should add vectors', function () {
      let vector = Vector.One();
      vector = vector.plus(Vector.Left());
      U.assert(vector.equals(Vector.Down()));
      vector.plusEquals(Vector.Up());
      U.assert(vector.equals(Vector.Zero()));
    });
    it('should subtract vectors', function () {
      let vector = Vector.One();
      vector = vector.minus(Vector.Right());
      U.assert(vector.equals(Vector.Down()));
      vector.minusEquals(Vector.Down());
      U.assert(vector.equals(Vector.Zero()));
    });
    it('should multiply vector by scalar', function () {
      let vector = Vector.One();
      vector = vector.times(5);
      U.assert(vector.equals(new Vector(5, 5)));
      vector.timesEquals(2);
      U.assert(vector.equals(new Vector(10, 10)));
    });
    it('should divide vector by scalar', function () {
      let vector = new Vector(16, 16);
      vector = vector.over(4);
      U.assert(vector.equals(new Vector(4, 4)));
      vector.overEquals(4);
      U.assert(vector.equals(Vector.One()));
    });
  });
  // ** --- Vector Geometry Math Functions --- ** //
  describe('vector geometry', function () {
    it('should rotate vector', function () {
      const vector = Vector.Up();
      // rotate original vector
      U.assert(vector.rotate(90).equals(Vector.Right(), 14));
      // create rotated copy of vector
      U.assert(vector.rotation(90).equals(Vector.Down(), 14));
      // ensure last step did not effect original
      U.assert(vector.equals(Vector.Right(), 14));
    });
    it('should normalize vector', function () {
      const vector = new Vector(2, 3);
      const normal = vector.normal();
      U.assert(normal.magnitude(), 1, { precision: 10 });
      U.assert(normal.direction(), vector.direction());
      vector.normalize();
      U.assert(normal.equals(vector));
    });
    it('should find dot product of vector', function () {
      U.assert(U.fix(Vector.One().dot(Vector.Zero())), 0);
      U.assert(U.fix(Vector.One().dot(Vector.Left())), -1);
      U.assert(U.fix(Vector.One().dot(Vector.Right())), 1);
      U.assert(U.fix(Vector.One().dot(Vector.One())), 2);
    });
  });
  // ** --- Vector Utility Functions --- ** //
  describe('vector utility', function () {
    it('should convert to Point', function () {
      const vector = Vector.One();
      U.assert(vector.constructor.name, 'Vector');
      const point = vector.toPoint();
      U.assert(point.constructor.name, 'Point');
      U.assert(vector.equals(point));
    });
    it('should convert to JSON', function () {
      const vector = Vector.One();
      U.assert(vector.constructor.name, 'Vector');
      const json = vector.json();
      U.assert(json.constructor.name, 'Object');
      U.assert(vector.equals(json));
    });
    it('should print as string', function () {
      const vector = new Vector(12, 34);
      U.assert(`${vector}`, 'Vector[12, 34]');
    });
    it('should make equivelant but non-reference equal copy', function () {
      const vector = new Vector(12, 34);
      const copy = vector.copy();
      U.assert(vector, copy, { not: true });
      U.assert(vector.equals(copy));
    });
  });
});
