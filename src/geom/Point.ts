import U from '../utilities';
import Vector from './Vector';

export default class Point {
  x: number;
  y: number;

  constructor (xOrPoint?: Point | number, y?: number) {
    if (xOrPoint instanceof Point) {
      this.x = xOrPoint.x ?? 0;
      this.y = xOrPoint.y ?? 0;
    } else if (y === undefined) {
      this.x = xOrPoint ?? 0;
      this.y = xOrPoint ?? 0;
    } else {
      this.x = xOrPoint ?? 0;
      this.y = y ?? 0;
    }
  }

  static Zero (): Point {
    return new Point(0, 0);
  }

  // ** --- Point Geometry Math Functions --- ** //
  equals (point: Point, precision?: number): boolean {
    const value = (precision !== undefined)
      ? U.fix(this.x, precision) === U.fix(point.x, precision) && U.fix(this.y, precision) === U.fix(point.y, precision)
      : this.x === point.x && this.y === point.y;
    U.log(`${this.toString()} equals ${point.toString()} (${precision ?? ''}): ${value.toString()}`, 'verbose');
    return value;
  }

  distance (point: Point): number {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  // In Radians
  direction (point: Point): number {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return Math.atan2(dy, dx);
  }

  // In Degrees
  angle (point: Point): number {
    return U.toDeg(this.direction(point));
  }

  // Moves the point be an amount
  translate (translationX: number, translationY: number): void {
    this.x += translationX;
    this.y += translationY;
  }

  // rotates the point around the pivot by degree
  rotate (pivot: Point, rotation: number): void {
    if (this.equals(pivot)) return;
    const radius = this.distance(pivot);
    const direction = pivot.direction(this);
    const rads = U.toRad(rotation);
    const nx = Math.cos(rads + direction) * radius;
    const ny = Math.sin(rads + direction) * radius;
    this.x = nx + pivot.x;
    this.y = ny + pivot.y;
  }

  // moves the point toward or away from the anchor by scale factor
  scale (anchor: Point, factorX: number, factorY: number): void {
    if (this.equals(anchor)) return;
    const dx = this.x - anchor.x;
    const dy = this.y - anchor.y;
    this.x += dx * factorX;
    this.y += dy * factorY;
  }

  // ** --- Point Utility Functions --- ** //
  toPoint (): Point {
    return this;
  }

  toVector (): Vector {
    return new Vector(this.x, this.y);
  }

  toString (): string {
    return `Point[${this.x}, ${this.y}]`;
  }

  json (): Object {
    return { x: this.x, y: this.y };
  }

  copy (): Point {
    return new Point(this.x, this.y);
  }
}
