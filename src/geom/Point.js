import U from '../utilities';
import Vector from './Vector';

export default class Point {
  constructor (xOrPoint, y) {
    if (typeof xOrPoint === 'object') {
      this.x = xOrPoint.x || 0;
      this.y = xOrPoint.y || 0;
    } else {
      this.x = xOrPoint || 0;
      this.y = y || 0;
    }
  }

  static Zero () {
    return new Point(0, 0);
  }

  // ** --- Point Geometry Math Functions --- ** //
  equals (point) {
    return this.x === point.x && this.y === point.y;
  }

  distance (point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  // In Radians
  direction (point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return Math.atan2(dy, dx);
  }

  // In Degrees
  angle (point) {
    return U.toDeg(this.direction(point));
  }

  // Moves the point be an amount
  translate (translationX, translationY) {
    this.x += translationX;
    this.y += translationY;
  }

  // rotates the point around the pivot by degree
  rotate (pivot, rotation) {
    if (this.equals(pivot)) return;
    const radius = this.distance(pivot);
    const direction = pivot.direction(this);
    const nx = Math.cos(U.toRad(rotation) + direction) * radius;
    const ny = Math.sin(U.toRad(rotation) + direction) * radius;
    this.x = nx + pivot.x;
    this.y = ny + pivot.y;
  }

  // moves the point toward or away from the anchor by scale factor
  scale (anchor, factorX, factorY) {
    if (this.equals(anchor)) return;
    const dx = this.x - anchor.x;
    const dy = this.y - anchor.y;
    this.x += dx * factorX;
    this.y += dy * factorY;
  }

  // ** --- Point Utility Functions --- ** //
  toPoint () {
    return this;
  }

  toVector () {
    return new Vector(this.x, this.y);
  }

  toString () {
    return `Point[${this.x}, ${this.y}]`;
  }

  json () {
    return { x: this.x, y: this.y };
  }

  copy () {
    return new Point(this.x, this.y);
  }
}
