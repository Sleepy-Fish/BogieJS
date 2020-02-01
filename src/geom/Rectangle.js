import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { Point } from '.';

const _defaults = {
  height: 1,
  width: 1
};

export default class Rectangle extends Spacial {
  constructor (parent, {
    height = _defaults.height,
    width = _defaults.width
  } = _defaults) {
    super(parent, arguments[1]);
    this.height = height;
    this.width = width;
    this.hypotenus = Math.sqrt(height * width);
    const hw = width / 2;
    const hh = height / 2;
    this.vertices = [
      new Point(hw, -hh),
      new Point(hw, hh),
      new Point(-hw, hh),
      new Point(-hw, -hh)
    ];
    this.type = 'rectangle';
  }

  makeDebug (container, color = 0x009900, vcolor = 0x990000) {
    super.makeDebug(container, color, vcolor);
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    this.debug.addChild(gfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    this.container.addChild(this.debug);
    return this;
  }

  project (normal) {
    let min = Infinity;
    var max = -Infinity;
    for (const point of this.vertices) {
      const dot = point.toVector().dot(normal);
      min = Math.min(dot, min);
      max = Math.max(dot, max);
    }
    return {
      min,
      max
    };
  }
}
