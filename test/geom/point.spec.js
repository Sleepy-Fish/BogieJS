import U from '../test.utilities';
import { Point } from '../../src/geom';

describe('Point', function () {
  // ** --- Point Geometry Math Functions --- ** //
  describe('geometry', function () {
    it('should find distance between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      U.assert(center.distance(hori), 10);
      U.assert(center.distance(vert), 10);
      U.assert(center.distance(square), Math.sqrt(64 + 64));
    });
    it('should find direction in radians between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      U.assert(center.direction(hori), 0);
      U.assert(center.direction(vert), Math.PI / 2);
      U.assert(center.direction(square), Math.PI / 4);
    });
    it('should find angle in degrees between two points', function () {
      const center = Point.Zero();
      const hori = new Point(10, 0);
      const vert = new Point(0, 10);
      const square = new Point(8, 8);
      U.assert(center.angle(hori), 0);
      U.assert(center.angle(vert), 90);
      U.assert(center.angle(square), 45);
    });
    it('should translate a points location', function () {
      const center = Point.Zero();
      const expected = new Point(12, 34);
      center.translate(12, 34);
      U.assert(center.equals(expected));
    });
    it('should rotate a point around a pivot', function () {
      const pivot = Point.Zero();
      const value = U.rndBetween(1, 100);
      const hori = new Point(value, 0);
      const vert = new Point(0, value);
      const edge = Math.sqrt((value * value) / 2);
      const square = new Point(edge, edge);
      const point = hori.copy();
      U.assert(point.equals(hori, 12));
      point.rotate(pivot, 45);
      U.assert(point.equals(square, 12));
      point.rotate(pivot, 45);
      U.assert(point.equals(vert, 12));
      point.rotate(pivot, -90);
      U.assert(point.equals(hori, 12));
    });
    it('should scale a point relative to an anchor', function () {
      const anchor = Point.Zero();
      const orig = new Point(10, 5);
      let point = orig.copy();
      point.scale(anchor, 1, 1);
      U.assert(20, point.x);
      U.assert(10, point.y);
      point = orig.copy();
      point.scale(anchor, -0.1, -0.1);
      U.assert(9, point.x);
      U.assert(4.5, point.y);
    });
  });
  // ** --- Point Utility Functions --- ** //
  describe('utility', function () {
    it('should convert to Vector', function () {
      const point = new Point(1, 1);
      U.assert(point.constructor.name, 'Point');
      const vector = point.toVector();
      U.assert(vector.constructor.name, 'Vector');
      U.assert(point.equals(vector));
    });
    it('should convert to JSON', function () {
      const point = new Point(1, 1);
      U.assert(point.constructor.name, 'Point');
      const json = point.json();
      U.assert(json.constructor.name, 'Object');
      U.assert(point.equals(json));
    });
    it('should print as string', function () {
      const point = new Point(12, 34);
      U.assert(`${point}`, 'Point[12, 34]');
    });
    it('should make equivelant but non-reference equal copy', function () {
      const point = new Point(12, 34);
      const copy = point.copy();
      U.assert(point, copy, { not: true });
      U.assert(point.equals(copy));
    });
  });
});
