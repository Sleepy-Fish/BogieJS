import U from '../utilities';
import * as PIXI from 'pixi.js';
import Shape from './Shapes';
import { Point } from '../geom';

export interface DebuggableOptions {
  shape: Shape;
  parent?: PIXI.Container;
  container?: PIXI.Container;
  radius?: number;
  height?: number;
  width?: number;
};

export function DDebuggable () {
  return function (target: any) {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Debuggable.prototype, 'init')?.value;
    Object.defineProperty(target.prototype, 'init', {
      value: function () {
        if (targetInit !== undefined) targetInit.call(this, arguments[0]);
        if (translatableInit !== undefined) translatableInit.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    const targetRun = Object.getOwnPropertyDescriptor(target.prototype, 'run')?.value;
    const translatableRun = Object.getOwnPropertyDescriptor(Debuggable.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Debuggable.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Debuggable.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
  };
}

export interface IDebuggable {
  id: string;
  debuggable: boolean;
  parent: PIXI.Container;
  container: PIXI.Container;
  debug: PIXI.Sprite;
  vdebug: PIXI.Sprite[];
  vertices: Point[];
  pos: Point;
  init: (options?: any) => void;
  run: (delta: number) => void;
  destroy: () => void;
  radius?: number;
  height?: number;
  width?: number;
}

export class Debuggable implements IDebuggable {
  id: string;
  public debuggable: boolean;
  shape: Shape;
  parent: PIXI.Container;
  container: PIXI.Container;
  debug: PIXI.Sprite;
  vdebug: PIXI.Sprite[];
  pos: Point;
  vertices: Point[];
  _lastPos: Point;
  radius?: number;
  height?: number;
  width?: number;

  constructor (options?: DebuggableOptions) {
    this.init(options);
  }

  public init (options?: DebuggableOptions): void {
    this.debuggable = true;
    if (this.id === undefined) this.id = U.uuid();
    if (this.shape === undefined) this.shape = options?.shape ?? Shape.NONE;
    if (this.parent === undefined) this.parent = options?.parent ?? new PIXI.Container();
    if (this.container === undefined) this.container = new PIXI.Container();
    if (this.debug === undefined) this.debug = new PIXI.Sprite();
    if (this.vdebug === undefined) this.vdebug = [];
    if (this.pos === undefined) this.pos = Point.Zero();
    if (this._lastPos === undefined) this._lastPos = this.pos.copy();
    if (this.vertices === undefined) this.vertices = [];
    if (this.radius === undefined) {
      this.radius = this.shape === Shape.CIRCLE
        ? (options?.radius !== undefined) ? options.radius : 1
        : undefined;
    }
    if (this.height === undefined) {
      this.height = this.shape === Shape.RECTANGLE
        ? (options?.height !== undefined) ? options.height : 1
        : undefined;
    }
    if (this.width === undefined) {
      this.width = this.shape === Shape.RECTANGLE
        ? (options?.width !== undefined) ? options.width : 1
        : undefined;
    }
    if (this.vertices === undefined) {
      const hw = (this.width ?? 1) / 2;
      const hh = (this.height ?? 1) / 2;
      switch (this.shape) {
        case Shape.RECTANGLE:
          this.vertices = [
            new Point(hw, -hh),
            new Point(hw, hh),
            new Point(-hw, hh),
            new Point(-hw, -hh),
          ];
          break;
        case Shape.CIRCLE:
          this.vertices = [Point.Zero()];
          break;
        default:
          this.vertices = [];
      }
    }
    this.debug.anchor.set(0.5, 0.5);
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, 0x009900);
    if (this.shape === Shape.RECTANGLE && this.height !== undefined && this.width !== undefined) {
      gfx.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    } else if (this.shape === Shape.CIRCLE && this.radius !== undefined) {
      gfx.drawCircle(0, 0, this.radius);
    }
    this.debug.addChild(gfx);
    this.debug.x = this.pos.x;
    this.debug.y = this.pos.y;
    this.container.addChild(this.debug);
    this.vertices.forEach(vertex => {
      const vdebug = new PIXI.Sprite();
      vdebug.anchor.set(0.5, 0.5);
      const vgfx = new PIXI.Graphics();
      vgfx.lineStyle(4, 0x990000);
      vgfx.drawCircle(0, 0, 1);
      vdebug.addChild(vgfx);
      vdebug.x = vertex.x;
      vdebug.y = vertex.y;
      this.container.addChild(vdebug);
      this.vdebug.push(vdebug);
      this.parent.addChild(this.container);
    });
  }

  public run (delta: number): void {
    if (this.debuggable && !this.pos.equals(this._lastPos)) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
      this.vdebug.forEach((vdebug, i) => {
        vdebug.x = this.vertices[i].x;
        vdebug.y = this.vertices[i].y;
      });
      this._lastPos = this.pos.copy();
    }
  };

  public destroy (): void {
    this.debuggable = false;
    this.container.removeChild(this.debug);
    this.vdebug.forEach(vdebug => {
      this.container.removeChild(vdebug);
    });
  };
}
