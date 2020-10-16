import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { CircleOptions } from './types';
import { Point } from './';

export default class Circle extends Spacial {
  readonly id: string; // For Internal Uniquness Identification
  readonly type: string; // TODO: convert this to enum
  radius: number;

  constructor (options?: CircleOptions) {
    super(options);
    this.radius = options?.radius ?? 1;
    this.type = 'circle';
    this.vertices = [Point.Zero()];
  }

  makeDebug (container: PIXI.Container, color: number = 0x009900, vcolor: number = 0x990000): Circle {
    super.makeDebug(container, color, vcolor);
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawCircle(0, 0, this.radius);
    if (this.container !== null && this.debug !== null) {
      this.debug.addChild(gfx);
      this.debug.x = this.x();
      this.debug.y = this.y();
      this.container.addChild(this.debug);
    }
    return this;
  }

  contains (point: Point): boolean {
    const value = this.pos.distance(point) <= this.radius;
    return value;
  }

  toString (): string {
    return `Circle[${this.radius}](${this.pos.toString()})`;
  }
}
