import U from '../utilities';
import Point from './Point';

export default class Vector {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static Zero () {
    return new Vector(0, 0);
  }

  static One () {
    return new Vector(1, 1);
  }

  static Up () {
    return new Vector(0, -1);
  }

  static Down () {
    return new Vector(0, 1);
  }

  static Left () {
    return new Vector(-1, 0);
  }

  static Right () {
    return new Vector(1, 0);
  }

  // ** --- Vector Property Getters / Setters --- ** //

  // In Radians
  direction (radians) {
    if (!arguments.length) return Math.atan2(this.y, this.x);
    const magnitude = this.magnitude();
    this.x = Math.cos(radians) * magnitude;
    this.y = Math.sin(radians) * magnitude;
    return this;
  }

  // In Degrees
  angle (degrees) {
    if (!arguments.length) return U.toDeg(this.direction());
    return this.direction(U.toRad(degrees));
  }

  magnitude (magnitude) {
    if (!arguments.length) return Math.sqrt((this.x * this.x) + (this.y * this.y));
    const direction = this.direction();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
    return this;
  }

  // ** --- Vector Arithmatic Functions --- ** //
  // ADDITION - Accepts vector and adds x and y respectively
  plus (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  plusEquals (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  // SUBTRACTION - Accepts vector and substracts x and y respectively
  minus (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  minusEquals (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  // MULTIPLICATION - Accepts scalar number and multiplies.
  times (scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  timesEquals (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // DIVISION - Accepts scalar number and divides.
  over (scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  overEquals (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  // ** --- Vector Geometry Math Functions --- ** //
  // Rotates this vector by a degree without effecting magnitude
  rotate (degree) {
    const r = this.angle();
    this.angle(r + degree);
    return this;
  }

  // Returns a new vector with applied degree rotation without effecting magnitude
  rotation (degree) {
    const r = this.angle();
    return this.copy().angle(r + degree);
  }

  // Sets this vectors magnitude to 1
  normalize () {
    const direction = this.direction();
    this.x = Math.cos(direction);
    this.y = Math.sin(direction);
    return this;
  }

  // Returns a new vector with direction but magnitude of 1
  normal () {
    const direction = this.direction();
    return new Vector(Math.cos(direction), Math.sin(direction));
  }

  // Just read online what dot product of vectors is.
  dot (vector) {
    return Math.abs(this.magnitude()) * Math.abs(this.magnitude()) * Math.cos(this.direction() - vector.direction());
  }

  // ** --- Vector Utility Functions --- ** //
  toPoint () {
    return Point(this.x, this.y);
  }

  toString () {
    return `Vector[${this.x}, ${this.y}]`;
  }

  json () {
    return { x: this.x, y: this.y };
  }

  copy () {
    return new Vector(this.x, this.y);
  }
}
