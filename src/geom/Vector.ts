import U from '../utilities';
import Point from './Point';

export default class Vector {
  x: number;
  y: number;

  constructor (x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  static Zero (): Vector {
    return new Vector(0, 0);
  }

  static One (): Vector {
    return new Vector(1, 1);
  }

  static Up (): Vector {
    return new Vector(0, -1);
  }

  static Down (): Vector {
    return new Vector(0, 1);
  }

  static Left (): Vector {
    return new Vector(-1, 0);
  }

  static Right (): Vector {
    return new Vector(1, 0);
  }

  // ** --- Vector Property Getters / Setters --- ** //

  // In Radians
  direction (radians: number): Vector
  direction (): number
  direction (radians?: number): number | Vector {
    if (radians === undefined) return Math.atan2(this.y, this.x);
    const magnitude = this.magnitude();
    if (magnitude === 0) U.log('Setting direction or angle on zero vector not advisable.', 'warn');
    this.x = Math.cos(radians) * magnitude;
    this.y = Math.sin(radians) * magnitude;
    return this;
  }

  // In Degrees
  angle (degrees: number): Vector
  angle (): number
  angle (degrees?: number): number | Vector {
    if (degrees === undefined) return U.toDeg(Math.atan2(this.y, this.x));
    return this.direction(U.toRad(degrees));
  }

  magnitude (magnitude: number): Vector
  magnitude (): number
  magnitude (magnitude?: number): number | Vector {
    if (magnitude === undefined) return Math.sqrt((this.x * this.x) + (this.y * this.y));
    const direction = this.direction();
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
    return this;
  }

  // ** --- Vector Arithmatic Functions --- ** //
  equals (vector: Vector, precision?: number): boolean {
    const value = (precision !== undefined)
      ? U.fix(this.x, precision) === U.fix(vector.x, precision) && U.fix(this.y, precision) === U.fix(vector.y, precision)
      : this.x === vector.x && this.y === vector.y;
    U.log(`${this.toString()} equals ${vector.toString()} (${precision ?? ''}): ${value.toString()}`, 'debug');
    return value;
  }

  // ADDITION - Accepts vector and adds x and y respectively
  plus (vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  plusEquals (vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  // SUBTRACTION - Accepts vector and substracts x and y respectively
  minus (vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  minusEquals (vector: Vector): Vector {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  // MULTIPLICATION - Accepts scalar number and multiplies.
  times (scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  timesEquals (scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // DIVISION - Accepts scalar number and divides.
  over (scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  overEquals (scalar: number): Vector {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  // ** --- Vector Geometry Math Functions --- ** //
  // Rotates this vector by a degree without effecting magnitude
  rotate (degree: number): Vector {
    const r = this.angle();
    return this.angle(r + degree);
  }

  // Returns a new vector with applied degree rotation without effecting magnitude
  rotation (degree: number): Vector {
    const r = this.angle();
    return this.copy().angle(r + degree);
  }

  // Sets this vectors magnitude to 1
  normalize (): Vector {
    const direction = this.direction();
    this.x = Math.cos(direction);
    this.y = Math.sin(direction);
    return this;
  }

  // Returns a new vector with direction but magnitude of 1
  normal (): Vector {
    const direction = this.direction();
    return new Vector(Math.cos(direction), Math.sin(direction));
  }

  // Just read online what dot product of vectors is.
  dot (vector: Vector): number {
    return this.magnitude() * vector.magnitude() * Math.cos(this.direction() - vector.direction());
  }

  // ** --- Vector Utility Functions --- ** //
  toPoint (): Point {
    return new Point(this.x, this.y);
  }

  toVector (): Vector {
    return this;
  }

  toString (): string {
    return `Vector[${this.x}, ${this.y}]`;
  }

  json (): Object {
    return { x: this.x, y: this.y };
  }

  copy (): Vector {
    return new Vector(this.x, this.y);
  }
}
