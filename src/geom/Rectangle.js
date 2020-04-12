import * as PIXI from 'pixi.js';
import Spacial from './Spacial';
import { Point } from '.';

const _defaults = {
  height: 1,
  width: 1
};

/**
 * Class of basic Rectagular shaped Spacial
 * @property {number} hypotenus Distance from from one corner to its furthest away opposite corner.
 * @extends Spacial
 * @class
 */
export default class Rectangle extends Spacial {
  /**
   * Creates Rectangle shaped Spacial
   * @param {Object} options Base level options for Circle.
   * @param {number} [options.height=1] Distance between top and bottom edge of unrotated Rectangle
   * @param {number} [options.width=1] Distance between left and right edge of unrotated Rectangle
   * @constructor
   */
  constructor ({
    height = _defaults.height,
    width = _defaults.width
  } = _defaults) {
    super(...arguments);
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

  /**
   * Creates a simple outline of the collision area of the Rectangle rendered by PIXI.js
   * @param {PIXI.Container} container What to PIXI container to draw the debug Rectangle onto.
   * @param {octal} color Color to render debug Rectangle
   * @param {octal} vcolor Color to render the vertex points of the Rectangle
   * @return {Circle} Returns this Rectangle for chaining functions.
   */
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
}
