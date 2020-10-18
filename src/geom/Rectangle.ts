import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { RectangleOptions } from './types';
import { Point } from './';

export default class Rectangle extends Spacial {
  readonly id: string; // For Internal Uniquness Identification
  readonly type: string; // TODO: convert this to enum
  height: number;
  width: number;
  hypotenus: number;

  constructor (options?: RectangleOptions) {
    super(options);
    this.height = options?.height ?? 1;
    this.width = options?.width ?? 1;
    this.hypotenus = Math.sqrt(this.height * this.width);
    const hw = this.width / 2;
    const hh = this.height / 2;
    this.vertices = [
      new Point(hw, -hh),
      new Point(hw, hh),
      new Point(-hw, hh),
      new Point(-hw, -hh),
    ];
    this.type = 'rectangle';
  }

  makeDebug (container: PIXI.Container, color?: number, vcolor?: number): Rectangle {
    super.makeDebug(container, (color ?? 0x009900), (vcolor ?? 0x990000));
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    if (this.container !== null && this.debug !== null) {
      this.debug.addChild(gfx);
      this.debug.x = this.x();
      this.debug.y = this.y();
      this.container.addChild(this.debug);
    }
    return this;
  }

  toString (): string {
    return `Rectangle[${this.width}x${this.height}](${this.pos.toString()})`;
  }
}
