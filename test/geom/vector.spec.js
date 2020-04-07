const assert = require('assert');
const U = require('../../src/utilities').default;
const Vector = require('../../src/geom/Vector').default;

describe('Vector', function () {
  // ** --- Vector Property Getters / Setters --- ** //
  describe('vector properties', function () {
    it('should get and set radian directions correctly', function () {
      const vector = Vector.One();
      const expected = U.fix(Math.atan2(2, 2));
      assert.strictEqual(vector.direction(), expected);
      vector.direction(0.25);
      assert.strictEqual(vector.direction(), 0.25);
    });
    it('should get and set degree angles correctly', function () {
      const vector = Vector.One();
      const expected = 45;
      assert.strictEqual(vector.angle(), expected);
      vector.angle(90);
      assert.strictEqual(vector.angle(), 90);
    });
    it('should get and set magnitude correctly', function () {
      const vector = Vector.One();
      const expected = Math.sqrt(2);
      assert.strictEqual(vector.magnitude(), expected);
    });
  });
  // ** --- Vector Arithmatic Functions --- ** //
  describe('vector arithmatic', function () {
    it('should add vectors', function () {
      let vector = Vector.One();
      vector = vector.plus(Vector.Left());
      assert(vector.equals(Vector.Down()));
      vector.plusEquals(Vector.Up());
      assert(vector.equals(Vector.Zero()));
    });
    it('should subtract vectors', function () {
      let vector = Vector.One();
      vector = vector.minus(Vector.Right());
      assert(vector.equals(Vector.Down()));
      vector.minusEquals(Vector.Down());
      assert(vector.equals(Vector.Zero()));
    });
    it('should multiply vector by scalar', function () {
      let vector = Vector.One();
      vector = vector.times(5);
      assert(vector.equals(new Vector(5, 5)));
      vector.timesEquals(2);
      assert(vector.equals(new Vector(10, 10)));
    });
    it('should divide vector by scalar', function () {
      let vector = new Vector(16, 16);
      vector = vector.over(4);
      assert(vector.equals(new Vector(4, 4)));
      vector.overEquals(4);
      assert(vector.equals(Vector.One()));
    });
  });
  // ** --- Vector Geometry Math Functions --- ** //
  describe('vector geometry', function () {
    it('should rotate vector', function () {
      const vector = Vector.Up();
      // rotate original vector
      assert(vector.rotate(90).equals(Vector.Right()));
      // create rotated copy of vector
      assert(vector.rotation(90).equals(Vector.Down()));
      // ensure last step did not effect original
      assert(vector.equals(Vector.Right()));
    });
    it('should normalize vector', function () {
      const vector = new Vector(2, 3);
      const normal = vector.normal();
      assert(normal.magnitude(), 1);
      assert(normal.direction(), vector.direction());
      vector.normalize();
      assert(normal.equals(vector));
    });
    it('should find dot product of vector', function () {
      assert.strictEqual(Vector.One().dot(Vector.Zero()), 0);
      assert.strictEqual(Vector.One().dot(Vector.Left()), -1);
      assert.strictEqual(Vector.One().dot(Vector.Right()), 1);
      assert.strictEqual(Vector.One().dot(Vector.One()), 2);
    });
  });
  // ** --- Vector Utility Functions --- ** //
  describe('vector utility', function () {
    it('should convert to Point', function () {
      const vector = Vector.One();
      assert.strictEqual(vector.constructor.name, 'Vector');
      const point = vector.toPoint();
      assert.strictEqual(point.constructor.name, 'Point');
      assert(vector.equals(point));
    });
    it('should convert to JSON', function () {
      const vector = Vector.One();
      assert.strictEqual(vector.constructor.name, 'Vector');
      const json = vector.json();
      assert.strictEqual(json.constructor.name, 'Object');
      assert(vector.equals(json));
    });
    it('should print as string', function () {
      const vector = new Vector(12, 34);
      assert.strictEqual(`${vector}`, 'Vector[12, 34]');
    });
    it('should make equivelant but non-reference equal copy', function () {
      const vector = new Vector(12, 34);
      const copy = vector.copy();
      assert.notStrictEqual(vector, copy);
      assert(vector.equals(copy));
    });
  });
});
