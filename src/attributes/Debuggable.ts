import U from '../utilities';
import * as PIXI from 'pixi.js';
import Shape from './Shapes';
import { Point, Vector } from '../geom';

export interface DebuggableOptions {
  shape: Shape;
  parent?: PIXI.Container;
  container?: PIXI.Container;
  radius?: number;
  height?: number;
  width?: number;
};

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
  color: ((color: number) => any) & (() => number);
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
  ang: number;
  scl: Vector;
  vertices: Point[];
  _lastPos: Point;
  _lastAng: number;
  _lastScl: Vector;
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
    if (this.ang === undefined) this.ang = 0;
    if (this.scl === undefined) this.scl = Vector.One();
    if (this._lastPos === undefined) this._lastPos = this.pos.copy();
    if (this._lastAng === undefined) this._lastAng = this.ang;
    if (this._lastScl === undefined) this._lastScl = this.scl.copy();
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
    if (this.vertices === undefined || this.vertices.length === 0) {
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
    });
    this.parent.addChild(this.container);
  }

  public run (delta: number): void {
    if (this.debuggable) {
      let moved = false;
      if (!this.pos.equals(this._lastPos)) {
        this.debug.x = this.pos.x;
        this.debug.y = this.pos.y;
        this._lastPos = this.pos.copy();
        moved = true;
      }
      if (this.ang !== this._lastAng) {
        this.debug.angle = this.ang;
        this._lastAng = this.ang;
        moved = true;
      }
      if (!this.scl.equals(this._lastScl)) {
        this.debug.scale.x = this.scl.x;
        this.debug.scale.y = this.scl.y;
        this._lastScl = this.scl.copy();
        moved = true;
      }
      if (moved) {
        this.vdebug.forEach((vdebug, i) => {
          vdebug.x = this.vertices[i].x;
          vdebug.y = this.vertices[i].y;
        });
      }
    }
  };

  public destroy (): void {
    this.debuggable = false;
    this.container.removeChild(this.debug);
    this.vdebug.forEach(vdebug => {
      this.container.removeChild(vdebug);
    });
  };

  public color (color: number): any;
  public color (): number;
  public color (color?: number): number|any {
    if (color === undefined) return (this.debug.children[0] as PIXI.Graphics).line.color;
    this.debug.removeChild();
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    if (this.shape === Shape.RECTANGLE && this.height !== undefined && this.width !== undefined) {
      gfx.drawRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    } else if (this.shape === Shape.CIRCLE && this.radius !== undefined) {
      gfx.drawCircle(0, 0, this.radius);
    }
    this.debug.addChild(gfx);
    this.debug.x = this.pos.x;
    this.debug.y = this.pos.y;
    return this;
  }
}
