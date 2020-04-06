const assert = require('assert');
const Vector = require('../../src/geom/Vector').default;

describe('Vector', function () {
  describe('direction', function () {
    it('should get and set radian directions correctly', function () {
      const vector = Vector.One();
      const expected = Math.atan2(1, 1);
      assert.strictEqual(vector.direction(), expected);
      vector.direction(0.25);
      assert.strictEqual(vector.direction(), 0.25);
    });
  });
  describe('angle', function () {
    it('should get and set degree angles correctly', function () {
      const vector = Vector.One();
      const expected = 45;
      assert.strictEqual(vector.angle(), expected);
      vector.angle(90);
      assert.strictEqual(vector.angle(), 90);
    });
  });
  describe('magnitude', function () {
    it('should get and set magnitude correctly', function () {
      const vector = Vector.One();
      const expected = Math.sqrt(2);
      assert.strictEqual(vector.magnitude(), expected);
    });
  });
  // ** --- Vector Arithmatic Functions --- ** //
  describe('plus', function () {
    it('should add vectors', function () {
      let vector = Vector.One();
      vector = vector.plus(Vector.Left());
      assert(vector.equals(Vector.Down()));
      vector.plusEquals(Vector.Up());
      assert(vector.equals(Vector.Zero()));
    });
  });
  describe('minus', function () {
    it('should subtract vectors', function () {
      let vector = Vector.One();
      vector = vector.minus(Vector.Right());
      assert(vector.equals(Vector.Down()));
      vector.minusEquals(Vector.Down());
      assert(vector.equals(Vector.Zero()));
    });
  });
});
