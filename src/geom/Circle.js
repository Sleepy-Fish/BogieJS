import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { Point, Vector } from '.';

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

  axes (other) {
    const axes = [];
    for (let i = 0; i < other.vertices.length; i++) {
      const n = i + 1 === other.vertices.length ? 0 : i + 1;
      const p1 = other.vertices[i].toVector();
      const p2 = other.vertices[n].toVector();
      const angle = Math.atan2(p2.x - p1.x, p2.y - p1.y);
      const tangent = new Vector(
        this.radius * Math.cos(angle),
        this.radius * Math.sin(angle)
      );
      axes.push();
    }
    return axes;
  }

  project (normal) {
    const point = this.vertices[0];
    const dot = point.toVector().dot(normal);
    return {
      min: dot - this.radius,
      max: dot + this.radius
    };
  }
}
