import U from '../utilities';
import Point from './Point';

export default class Line {
  constructor (pointOrArray, point) {
    if (Array.isArray(pointOrArray)) {
      this.p1 = pointOrArray[0];
      this.p2 = pointOrArray[1];
    } else {
      this.p1 = pointOrArray;
      this.p2 = point;
    }
  }

  // ** --- Line Property Getters / Setters --- ** //
  start (point) {
    if (U.getter(arguments)) return this.p1;
    this.p1 = point;
    return this;
  }

  end (point) {
    if (U.getter(arguments)) return this.p2;
    this.p2 = point;
    return this;
  }

  // Updates end point relative to existing start point unless anchorEnd specified
  length (length, anchorEnd = false) {
    if (U.getter(arguments)) return this.p1.distance(this.p2);
    let dir = this.direction();
    if (anchorEnd) dir += Math.PI;
    const p = new Point(
      Math.cos(dir) * length,
      Math.sin(dir) * length
    );
    return anchorEnd ? this.start(p) : this.end(p);
  }

  // In Radians
  direction (radians, anchorEnd = false) {
    if (U.getter(arguments)) return this.p1.direction(this.p2);
    const len = this.length();
    const p = new Point(
      Math.cos(radians) * len,
      Math.sin(radians) * len
    );
    return anchorEnd ? this.start(p) : this.end(p);
  }

  // In Degrees
  angle (degrees, anchorEnd = false) {
    if (U.getter(arguments)) return U.toDeg(this.direction());
    return this.direction(U.toRad(degrees), anchorEnd);
  }

  // ** --- Line Geometry Math Functions --- ** //
  equals (line, precision = null) {
    if (Array.isArray(line)) line = new Line(line);
    if (precision) return this.p1.equals(line.p1, precision) && this.p2.equals(line.p2, precision);
    return this.p1.equals(line.p1) && this.p2.equals(line.p2);
  }

  // Moves the point be an amount
  translate (translationX, translationY) {
    this.p1.translate(translationX, translationY);
    this.p2.translate(translationX, translationY);
  }

  // if point exists along line
  contains (point, precision = null) {
    let sumOfDistance = this.start().distance(point) + this.end().distance(point);
    let length = this.length();
    if (precision) {
      sumOfDistance = U.fix(sumOfDistance, precision);
      length = U.fix(length, precision);
    }
    return sumOfDistance === length && this.direction() === this.start().direction(point);
  }

  // If crosses line
  // This is largely flattened linear math and is a bit hard to follow the logic of in line.
  // For full explaination on this function: https://observablehq.com/@toja/line-box-intersection
  crosses (line, precision = null) {
    // Find shared denominator of both linear equations
    const d = (this.p1.x - this.p2.x) * (line.p1.y - line.p2.y) - (this.p1.y - this.p2.y) * (line.p1.x - line.p2.x);
    // If denominator is zero it implies lines are parellel so check if lines are coincident
    if (d === 0) return this.contains(line.p1, precision) || this.contains(line.p2, precision);
    // Bezier coefficient for both lines
    const t = ((this.p1.x - line.p1.x) * (line.p1.y - line.p2.y) - (this.p1.y - line.p1.y) * (line.p1.x - line.p2.x)) / d;
    const u = -((this.p1.x - this.p2.x) * (this.p1.y - line.p1.y) - (this.p1.y - this.p2.y) * (this.p1.x - line.p1.x)) / d;
    // Intersects if Bezier coefficient is between 0 and 1
    if ((t >= 0 && t <= 1) && (u >= 0 && u <= 1)) {
      // Calculate intersection point using Beziers formula
      return new Point(
        this.p1.x + t * (this.p2.x - this.p1.x),
        this.p1.y + t * (this.p2.y - this.p1.y)
      );
    }
    return false;
  }

  // ** --- Line Utility Functions --- ** //
  toString () {
    return `Line[(${this.p1.x}, ${this.p1.y}) - (${this.p2.x}, ${this.p2.y})]`;
  }

  json () {
    return [{ x: this.p1.x, y: this.p1.y }, { x: this.p2.x, y: this.p2.y }];
  }

  copy () {
    return new Line(this.p1, this.p2);
  }
}
