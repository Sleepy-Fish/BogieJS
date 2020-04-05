export default class Line {
  constructor (Point1, Point2) {
    this.p1 = Point1;
    this.p2 = Point2;
  }

  // ** --- Point Geometry Math Functions --- ** //
  equals (line) {
    return this.p1.equals(line.p1) && this.p2.equals(line.p2);
  }

  // In Radians
  direction (point) {
    return this.p1.direction(this.p2);
  }

  // In Degrees
  angle (point) {
    return this.p1.angle(this.p2);
  }

  length () {
    return this.p1.distance(this.p2);
  }

  // Moves the point be an amount
  translate (translationX, translationY) {
    this.p1.translate(translationX, translationY);
    this.p2.translate(translationX, translationY);
  }

  // if point exists along line
  contains (point) {
    return false;
  }

  // if crosses line
  crosses (line) {
    return false;
  }

  // ** --- Line Utility Functions --- ** //
  toString () {
    return `Line[${this.p1} - ${this.p2}]`;
  }

  json () {
    return [{ x: this.p1.x, y: this.p1.y }, { x: this.p2.x, y: this.p2.y }];
  }

  copy () {
    return new Line(this.p1, this.p2);
  }
}
