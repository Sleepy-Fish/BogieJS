import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { Point } from '.';

const _defaults = {
  radius: 1
};

/**
 * Class of basic circular shaped Spacial
 * @extends Spacial
 * @class
 */
export default class Circle extends Spacial {
  /**
   * Class of basic circular shaped spacial
   * @param {Object} options Base level options for Circle.
   * @param {number} [options.radius=1] Distance from center position to edge of circle
   * @constructor
   */
  constructor ({
    radius = _defaults.radius
  } = _defaults) {
    super(...arguments);
    this.radius = radius;
    this.type = 'circle';
    this.vertices = [new Point()];
  }

  /**
   * Creates a simple outline of the collision area of the circle rendered by PIXI.js
   * @param {PIXI.Container} container What to PIXI container to draw the debug circle onto.
   * @param {octal} color Color to make debug circle
   * @param {octal} vcolor Color to make center point of circle
   * @return {Circle} Returns this Circle for chaining functions.
   */
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
}
