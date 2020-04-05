import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { Point } from '.';

const _defaults = {
  radius: 1
};

export default class Circle extends Spacial {
  constructor (parent, {
    radius = _defaults.radius
  } = _defaults) {
    super(parent, arguments[1]);
    this.radius = radius;
    this.type = 'circle';
    this.vertices = [new Point()];
  }

  makeDebug (container, color = 0x009900, vcolor = 0x990000) {
    super.makeDebug(container, color, vcolor);
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawCircle(0, 0, this.radius);
    this.debug.addChild(gfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    this.container.addChild(this.debug);
    return this;
  }

  contains (point) {
    return this.pos.distance(point) < this.radius;
  }
}
