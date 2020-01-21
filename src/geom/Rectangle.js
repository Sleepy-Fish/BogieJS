import * as PIXI from 'pixi.js';
import Spacial from './Spacial';

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
    this.type = 'rectangle';
  }

  makeDebug (container, color = 0x009900) {
    if (this.debug) this.container.removeChild(this.debug);
    super.makeDebug(container);
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    this.debug.addChild(gfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    container.addChild(this.debug);
    return this;
  }
}
