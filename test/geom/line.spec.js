const assert = require('assert');
const U = require('../../src/utilities').default;
const Point = require('../../src/geom/Point').default;
const Line = require('../../src/geom/Line').default;

describe('Line', function () {
  describe('line properties', function () {
    it('should get and set start point correctly', function () {
      const line = new Line(Point.Zero(), new Point(10, 10));
      const expected = new Point(5, 5);
      assert(line.start().equals(Point.Zero()));
      line.start(expected);
      assert(!line.start().equals(Point.Zero()));
      assert(line.start().equals(expected));
    });
    it('should get and set end point correctly', function () {
      const line = new Line(new Point(10, 10), Point.Zero());
      const expected = new Point(5, 5);
      assert(line.end().equals(Point.Zero()));
      line.end(expected);
      assert(!line.end().equals(Point.Zero()));
      assert(line.end().equals(expected));
    });
    it('should get and set length correctly', function () {
      const hori = new Line(Point.Zero(), new Point(10, 0));
      const vert = new Line(new Point(0, -10), Point.Zero());
      const slant = new Line(Point.Zero(), new Point(10, 10));
      assert.strictEqual(hori.length(), 10);
      hori.length(5);
      assert(hori.start().equals(Point.Zero()));
      assert(hori.end().equals(new Point(5, 0)));
      assert.strictEqual(vert.length(), 10);
      vert.length(5, true);
      assert(vert.start().equals(new Point(0, -5), 14));
      assert(vert.end().equals(Point.Zero()));
      assert.strictEqual(slant.length(), Math.sqrt((10 * 10) + (10 * 10)));
      slant.length(Math.sqrt((5 * 5) + (5 * 5)));
      assert.strictEqual(U.fix(slant.end().x - slant.start().x), 5);
      assert.strictEqual(U.fix(slant.end().y - slant.start().y), 5);
    });
    it('should get and set direction in radians correctly', function () {
      const value = U.rndBetween(1, 100);
      const hori = new Line(Point.Zero(), new Point(value, 0));
      const vert = new Line(Point.Zero(), new Point(0, value));
      const edge = Math.sqrt((value * value) / 2);
      const slant = new Line(Point.Zero(), new Point(edge, edge));
      assert.strictEqual(hori.direction(), 0);
      assert.strictEqual(vert.direction(), Math.PI / 2);
      assert.strictEqual(slant.direction(), Math.PI / 4);
      const copy = hori.copy();
      assert(hori.equals(copy));
      copy.direction(Math.PI / 2);
      assert(vert.equals(copy, 12));
      copy.direction(Math.PI / 4);
      assert(slant.equals(copy, 12));
    });
    it('should get and set angle in degrees correctly', function () {
      const value = U.rndBetween(1, 100);
      const hori = new Line(Point.Zero(), new Point(value, 0));
      const vert = new Line(Point.Zero(), new Point(0, value));
      const edge = Math.sqrt((value * value) / 2);
      const slant = new Line(Point.Zero(), new Point(edge, edge));
      assert.strictEqual(hori.angle(), 0);
      assert.strictEqual(vert.angle(), 90);
      assert.strictEqual(slant.angle(), 45);
      const copy = hori.copy();
      assert(hori.equals(copy));
      copy.angle(90);
      assert(vert.equals(copy, 12));
      copy.angle(45);
      assert(slant.equals(copy, 12));
    });
  });
  // ** --- Line Geometry Math Functions --- ** //
  describe('line geometry', function () {
    it('should find the direction in radians of a line', function () {
      const hori = new Line(Point.Zero(), new Point(10, 0));
      const vert = new Line(Point.Zero(), new Point(0, 10));
      const slant = new Line(Point.Zero(), new Point(10, 10));
      assert.strictEqual(hori.direction(), 0);
      assert.strictEqual(vert.direction(), Math.PI / 2);
      assert.strictEqual(slant.direction(), Math.PI / 4);
    });
    it('should find the angle in degrees of a line', function () {
      const hori = new Line(Point.Zero(), new Point(10, 0));
      const vert = new Line(Point.Zero(), new Point(0, 10));
      const slant = new Line(Point.Zero(), new Point(10, 10));
      assert.strictEqual(hori.angle(), 0);
      assert.strictEqual(vert.angle(), 90);
      assert.strictEqual(slant.angle(), 45);
    });
    it('should translate a line to a new location', function () {
      const line = new Line(Point.Zero(), new Point(10, 10));
      const copy = line.copy();
      assert(line.equals(copy));
      copy.translate(5, 5);
      assert(line.equals(copy), false);
      // assert.strictEqual(line.x)
      copy.translate(-5, -5);
      assert(line.equals(copy));
    });
    it('should determine if line contains a point along its segment', function () {
      const line = new Line(Point.Zero(), new Point(10, 0));
      let point = Point.Zero();
      assert(line.contains(point));
      point = new Point(10, 0);
      assert(line.contains(point));
      point = new Point(6, 0);
      assert(line.contains(point));
      point = new Point(4, 1);
      assert(!line.contains(point));
      point = new Point(-1, 0);
      assert(!line.contains(point));
      point = new Point(10.1, 0);
      assert(!line.contains(point));
    });
    it('should determine if line crosses another line', function () {
      const edge = U.rndBetween(3, 100);
      const line = new Line(Point.Zero(), new Point(edge, edge));
      // Perpendicular intersection at the halfway point //
      let intersection = line.crosses(new Line(new Point(0, edge), new Point(edge, 0)));
      assert(intersection);
      assert.strictEqual(intersection.constructor.name, 'Point');
      assert(intersection.equals(new Point(edge / 2, edge / 2)));
      // Parellel non-intersection //
      intersection = line.crosses(new Line(new Point(edge / 2, 1), new Point(edge, (edge / 2) + 1)));
      assert(!intersection);
      // Non-parellel non-intersection //
      intersection = line.crosses(new Line(new Point(edge / 2, 1), new Point(edge, (edge / 2))));
      assert(!intersection);
      // Parellel coincident lines (on top of each other) //
      intersection = line.crosses(new Line(new Point(edge - 2, edge - 2), new Point(edge * 2, edge * 2)), 12);
      assert.strictEqual(intersection.constructor.name, 'Boolean');
      assert(intersection);
      // Perpendicular end-point intersection //
      intersection = line.crosses(new Line(new Point(edge, edge), new Point(edge * 2, 0)));
      assert(intersection);
      assert.strictEqual(intersection.constructor.name, 'Point');
      assert(intersection.equals(new Point(edge, edge)));
      // Perpendicular non-intersection //
      intersection = line.crosses(new Line(new Point(edge + 1, edge + 1), new Point((edge * 2) + 1, 1)));
      assert(!intersection);
    });
  });
  // ** --- Line Utility Functions --- ** //
  describe('line utility', function () {
    it('should convert to JSON', function () {
      const line = new Line(new Point(1, 2), new Point(3, 4));
      assert.strictEqual(line.constructor.name, 'Line');
      const json = line.json();
      assert.strictEqual(json.constructor.name, 'Array');
      assert(line.equals(json));
    });
    it('should print as string', function () {
      const line = new Line(new Point(1, 2), new Point(3, 4));
      assert.strictEqual(`${line}`, 'Line[(1, 2) - (3, 4)]');
    });
    it('should make equivelant but non-reference equal copy', function () {
      const line = new Line(new Point(1, 2), new Point(3, 4));
      const copy = line.copy();
      assert.notStrictEqual(line, copy);
      assert(line.equals(copy));
    });
  });
});
