const assert = require('assert');
const U = require('../../src/utilities').default;
const Point = require('../../src/geom/Point').default;

describe('Point', function () {
  // ** --- Point Geometry Math Functions --- ** //
  describe('geometry', function () {
    it('should find distance between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      assert.strictEqual(center.distance(hori), 10);
      assert.strictEqual(center.distance(vert), 10);
      assert.strictEqual(center.distance(square), Math.sqrt(64 + 64));
    });
    it('should find direction in radians between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      assert.strictEqual(center.direction(hori), 0);
      assert.strictEqual(center.direction(vert), Math.PI / 2);
      assert.strictEqual(center.direction(square), Math.PI / 4);
    });
    it('should find angle in degrees between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      assert.strictEqual(center.angle(hori), 0);
      assert.strictEqual(center.angle(vert), 90);
      assert.strictEqual(center.angle(square), 45);
    });
    it('should translate a points location', function () {
      const center = Point.Zero();
      const expected = new Point(12, 34);
      center.translate(12, 34);
      assert(center.equals(expected));
    });
    it('should rotate a point around a pivot', function () {
      const pivot = Point.Zero();
      const value = U.rndBetween(1, 100);
      const hori = new Point(value, 0);
      const vert = new Point(0, value);
      const edge = Math.sqrt((value * value) / 2);
      const square = new Point(edge, edge);
      const point = hori.copy();
      assert(point.equals(hori, 12));
      point.rotate(pivot, 45);
      assert(point.equals(square, 12));
      point.rotate(pivot, 45);
      assert(point.equals(vert, 12));
      point.rotate(pivot, -90);
      assert(point.equals(hori, 12));
    });
    it('should scale a point relative to an anchor', function () {
      const anchor = Point.Zero();
      const orig = new Point(10, 5);
      let point = orig.copy();
      point.scale(anchor, 1, 1);
      assert.strictEqual(20, point.x);
      assert.strictEqual(10, point.y);
      point = orig.copy();
      point.scale(anchor, -0.1, -0.1);
      assert.strictEqual(9, point.x);
      assert.strictEqual(4.5, point.y);
    });
  });
  // ** --- Point Utility Functions --- ** //
  describe('utility', function () {
    it('should convert to Vector', function () {
      const point = new Point(1, 1);
      assert.strictEqual(point.constructor.name, 'Point');
      const vector = point.toVector();
      assert.strictEqual(vector.constructor.name, 'Vector');
      assert(point.equals(vector));
    });
    it('should convert to JSON', function () {
      const point = new Point(1, 1);
      assert.strictEqual(point.constructor.name, 'Point');
      const json = point.json();
      assert.strictEqual(json.constructor.name, 'Object');
      assert(point.equals(json));
    });
    it('should print as string', function () {
      const point = new Point(12, 34);
      assert.strictEqual(`${point}`, 'Point[12, 34]');
    });
    it('should make equivelant but non-reference equal copy', function () {
      const point = new Point(12, 34);
      const copy = point.copy();
      assert.notStrictEqual(point, copy);
      assert(point.equals(copy));
    });
  });
});
