import { World, Watcher } from '../physics';
import { CollisionEvent } from '../types';
import { SpacialOptions, Projection } from './types';
import U from '../utilities';
import * as PIXI from 'pixi.js';
import { Point, Vector, Line } from './';

export default abstract class Spacial {
  readonly id: string; // For Internal Uniquness Identification
  readonly type: string; // TODO: convert this to enum
  protected parent: Spacial|null; // Can be null or referential to another Spacial.
  protected vertices: Point[];

  protected container: PIXI.Container|null;
  protected world: World|null;
  protected watchers: { [key: string]: Watcher; }; // World.watcher object set by 'makeCollidable' function
  protected layer: string;

  protected pos: Point; // Position - Tranlational value
  protected vel: Vector; // Velocity - Change in translation per tick
  protected ang: number; // Angle - Rotational value
  protected rot: number; // Rotation - Change in rotation per tick
  protected scl: Vector; // Scale - Dilational value
  protected dil: Vector; // Dilation - Change in dilation per tick

  dynamic: boolean; // Spacial values are updated per tick
  awake: boolean; // Collision being checked per tick

  sprite: PIXI.Sprite|null; // PIXI.Sprite object set by 'makeSprite' function
  gfx: PIXI.Graphics|null; // PIXI.Graphics object set by 'makeSprite' function
  debug: PIXI.Sprite|null; // PIXI.Sprite object set by 'makeDebug' function
  vdebug: PIXI.Sprite[]|null; // PIXI.Sprites vertices set by 'makeDebug' function

  maxSpeed: number; // Upper bound +/- velocity at this value
  minSpeed: number; // Lower bound +/- velocity at this value
  maxRotation: number; // Upper bound +/- rotation at this value
  minRotation: number; // Lower bound +/- rotation at this value
  maxSize: number; // Upper bound +/- scale factor at this value
  minSize: number; // Lower bound +/- scale factor at this value
  lockVelocityToAngle: boolean; // If true, velocity is always relative to angle like propulsion.

  constructor (options?: SpacialOptions) {
    this.id = U.uuid();
    this.parent = options?.parent ?? null;
    this.vertices = [];

    this.container = null;
    this.world = null;
    this.layer = 'default';
    this.watchers = {};

    // Spacial values
    this.pos = Point.Zero();
    this.vel = Vector.Zero();
    this.ang = 0;
    this.rot = 0;
    this.scl = Vector.One();
    this.dil = Vector.Zero();

    // States
    this.dynamic = true;
    this.awake = true;

    // Object extensions
    this.sprite = null;
    this.gfx = null;
    this.debug = null;
    this.vdebug = null;

    // Spacial Settings
    this.maxSpeed = options?.maxSpeed ?? Infinity;
    this.minSpeed = options?.minSpeed ?? 0;
    this.maxRotation = options?.maxRotation ?? Infinity;
    this.minRotation = options?.minRotation ?? 0;
    this.maxSize = options?.maxSize ?? Infinity;
    this.minSize = options?.minSize ?? 0;
    this.lockVelocityToAngle = options?.lockVelocityToAngle ?? false;

    // Option Assertions
    if (this.maxSpeed < this.minSpeed) throw Error(`maxSpeed (${this.maxSpeed}) cannot be lower than minSpeed (${this.minSpeed})`);
    if (this.minSpeed !== 0) this.velocity(Vector.Zero());
    if (this.maxRotation < this.minRotation) throw Error(`maxRotation (${this.maxRotation}) cannot be lower than minRotation (${this.minRotation})`);
    if (this.maxSize < this.minSize) throw Error(`maxSize (${this.maxSize}) cannot be lower than minSize (${this.minSize})`);
  }

  makeSprite (container: PIXI.Container): Spacial {
    if (this.container === null) this.container = container;
    this.sprite = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.gfx);
    this.container.addChild(this.sprite);
    return this;
  }

  makeDebug (container: PIXI.Container, color: number, vcolor: number): Spacial {
    if (this.container === null) this.container = container;
    if (this.debug !== null) this.container.removeChild(this.debug);
    if (this.vdebug !== null) for (const vdebug of this.vdebug) this.container.removeChild(vdebug);
    // NOTE: debug sprite gets drawn and attached to container in subclasses
    this.debug = new PIXI.Sprite();
    this.debug.anchor.set(0.5, 0.5);
    this.vdebug = [];
    for (const vertex of this.vertices) {
      const vdebug = new PIXI.Sprite();
      vdebug.anchor.set(0.5, 0.5);
      const vgfx = new PIXI.Graphics();
      vgfx.lineStyle(4, vcolor);
      vgfx.drawCircle(0, 0, 1);
      vdebug.addChild(vgfx);
      vdebug.x = vertex.x;
      vdebug.y = vertex.y;
      this.container.addChild(vdebug);
      this.vdebug.push(vdebug);
    }
    return this;
  }

  makeCollidable (world: World, layer: string = 'default'): Spacial {
    this.world = world;
    this.layer = layer;
    this.world.add(this, this.layer);
    this.watchers = {};
    return this;
  }

  on (event: CollisionEvent, cb: (...args: any[]) => any, interactor: string = 'default'): Spacial {
    if (this.world === null) {
      U.log('Must call `makeCollidable` before binding collision events', 'warn');
      return this;
    }
    const id = this.world.getId(interactor);
    if (!(this.watchers[id] instanceof Watcher)) this.watchers[id] = this.world.watcher(this, interactor);
    this.watchers[id].on(event, cb);
    return this;
  }

  off (event: CollisionEvent, interactor: string = 'default'): Spacial {
    if (this.world === null) {
      U.log('Must call `makeCollidable` before unbinding collision events', 'warn');
      return this;
    }
    const id = this.world.getId(interactor);
    if (this.watchers[id] instanceof Watcher) this.watchers[id].removeAllListeners(event);
    return this;
  }

  // Collision Related Functions
  axes (other: Spacial): Vector[] {
    const axes: Vector[] = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const n = i + 1 === this.vertices.length ? 0 : i + 1;
      const p1 = this.vertices[i].toVector();
      const p2 = this.vertices[n].toVector();
      const edge = p1.minus(p2);
      edge.x *= -1;
      axes.push(edge);
    }
    return axes;
  }

  project (normal: Vector): Projection {
    let min = Infinity;
    var max = -Infinity;
    for (const point of this.vertices) {
      const dot = point.toVector().dot(normal);
      min = Math.min(dot, min);
      max = Math.max(dot, max);
    }
    return {
      min,
      max,
    };
  }

  edges (): Line[] {
    const edges: Line[] = [];
    if (this.vertices.length < 3) return edges;
    for (let i = 1; i < this.vertices.length; i++) {
      edges.push(new Line(this.vertices[i - 1], this.vertices[i]));
    }
    edges.push(new Line(this.vertices[this.vertices.length - 1], this.vertices[0]));
    return edges;
  }

  contains (point: Point): boolean {
    let cross = 0;
    const cast = new Line(point, new Point(Number.MAX_SAFE_INTEGER, point.y));
    for (const edge of this.edges()) {
      if (edge.crosses(cast)) cross++;
    }
    const value = cross % 2 === 1;
    U.log(`${this.toString()} contains ${point.toString()} (): ${value.toString()}`, 'verbose');
    return value;
  }

  /**
   * Cleans up any artifacts that could prevent this from being garbage collected.
   */
  destroy (): void {
    this.run = () => {};
    for (const watcher of Object.values(this.watchers)) watcher.removeAllListeners();
    this.watchers = {};
    if (this.container !== null && this.sprite !== null) this.container.removeChild(this.sprite);
    if (this.container !== null && this.debug !== null) this.container.removeChild(this.debug);
    if (this.world !== null) this.world.remove(this, this.layer);
  }

  run (delta: number): void {
    if (this.dynamic) {
      this.shift(this.vel);
      this.rotate(this.rot);
      this.dilate(this.dil);
    }
    if (this.awake) {
      for (const watcher of Object.values(this.watchers)) watcher.run(delta);
    }
  }

  /* =============================================================================================
   * ========== TRANSLATE FUNCTIONS ==============================================================
   * = Functions that deal with the coordinate location of the Spacial relative to its container =
   * ============================================================================================= */

  position (xOrPoint: Point | number, y?: number, cb?: Function): Spacial
  position (): Point
  position (xOrPoint?: Point | number, y?: number, cb?: Function): Point | Spacial {
    if (xOrPoint === undefined) return this.pos.copy();
    const origin = this.pos.copy();
    if (xOrPoint instanceof Point) {
      this.pos.x = xOrPoint.x;
      this.pos.y = xOrPoint.y;
    } else if (y === undefined) {
      this.pos.x = xOrPoint;
      this.pos.y = xOrPoint;
    } else {
      this.pos.x = xOrPoint;
      this.pos.y = y;
    }
    const delta = { x: this.pos.x - origin.x, y: this.pos.y - origin.y };
    for (const vertex of this.vertices) {
      vertex.translate(delta.x, delta.y);
    }
    if (this.sprite !== null) {
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
    }
    if (this.debug !== null) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
      for (const i in this.vdebug) {
        this.vdebug[Number(i)].x = this.vertices[Number(i)].x;
        this.vdebug[Number(i)].y = this.vertices[Number(i)].y;
      }
    }
    if (cb !== undefined) cb(delta.x, delta.y);
    return this;
  }

  x (val: number): Spacial
  x (): number
  x (val?: number): number | Spacial {
    if (val === undefined) return this.pos.x;
    return this.position(val, this.pos.y);
  }

  y (val: number): Spacial
  y (): number
  y (val?: number): number | Spacial {
    if (val === undefined) return this.pos.y;
    return this.position(this.pos.x, val);
  }

  shift (xOrVector: Vector | number, y?: number): Spacial {
    if (xOrVector instanceof Vector) {
      return this.position(this.pos.x + xOrVector.x, this.pos.y + xOrVector.y);
    } else if (y === undefined) {
      return this.shift(xOrVector, xOrVector);
    } else {
      return this.position(this.pos.x + xOrVector, this.pos.y + y);
    }
  }

  velocity (xOrVector: Vector | number, y?: number): Spacial
  velocity (): Vector
  velocity (xOrVector?: Vector | number, y?: number): Vector | Spacial {
    if (xOrVector === undefined) return this.vel.copy();
    if (xOrVector instanceof Vector) {
      this.vel.x = xOrVector.x;
      this.vel.y = xOrVector.y;
    } else if (y === undefined) {
      this.vel.x = xOrVector;
      this.vel.y = xOrVector;
    } else {
      this.vel.x = xOrVector;
      this.vel.y = y;
    }
    // Cap the velocity to upper and lower bounds
    if (this.vel.magnitude() > this.maxSpeed) this.vel.magnitude(this.maxSpeed);
    if (this.vel.magnitude() < this.minSpeed) this.vel.magnitude(this.minSpeed);
    return this;
  }

  velocityX (val: number): Spacial
  velocityX (): number
  velocityX (val?: number): number | Spacial {
    if (val === undefined) return this.vel.x;
    return this.velocity(val, this.vel.y);
  }

  velocityY (val: number): Spacial
  velocityY (): number
  velocityY (val?: number): number | Spacial {
    if (val === undefined) return this.vel.y;
    return this.velocity(this.vel.x, val);
  }

  accelerate (xOrVector: Vector | number, y?: number): Spacial {
    if (xOrVector instanceof Vector) {
      return this.velocity(this.vel.plus(xOrVector));
    } else if (y === undefined) {
      return this.accelerate(xOrVector, xOrVector);
    } else {
      return this.velocity(this.vel.x + xOrVector, this.vel.y + y);
    }
  }

  /* ===================================================================
   * ========== ROTATION FUNCTIONS =====================================
   * = Functions that deal with the 2D angle of the Spacial in degrees =
   * =================================================================== */

  angle (degree: number, cb?: Function): Spacial
  angle (): number
  angle (degree?: number, cb?: Function): number | Spacial {
    if (degree === undefined) return U.clampAngle(this.ang);
    const origin = this.ang;
    this.ang = U.clampAngle(degree);
    const delta = this.ang - origin;
    for (const vertex of this.vertices) {
      vertex.rotate(this.pos, delta);
    }
    if (this.sprite !== null) this.sprite.angle = this.ang;
    if (this.debug !== null) {
      this.debug.angle = this.ang;
      if (this.vdebug !== null) {
        this.vdebug.forEach((sprite, i) => {
          sprite.x = this.vertices[i].x;
          sprite.y = this.vertices[i].y;
        });
      }
    }
    if (this.lockVelocityToAngle) this.vel.angle(this.ang);
    if (cb !== undefined) cb(this.ang - origin);
    return this;
  }

  rotate (degree: number): Spacial {
    this.angle(this.ang + degree);
    return this;
  }

  rotation (degree: number): Spacial
  rotation (): number
  rotation (degree?: number): number | Spacial {
    if (degree === undefined) return this.rot;
    this.rot = degree;
    // Cap the rotation to upper and lower bounds
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
    if (Math.abs(this.rot) < this.minRotation) this.rotation(this.minRotation * Math.sign(this.rot));
    return this;
  }

  spin (degree: number): Spacial {
    this.rotation(this.rot + degree);
    return this;
  }

  /* =========================================================================================================================================
   * ========== TRANSFORM FUNCTIONS ==========================================================================================================
   * = Functions that deal with the scale and dimensions of the Spacial's visual and collision bounds relative to constants.json SCALE value =
   * ========================================================================================================================================= */

  scale (xOrVector: Vector | number, y?: number, cb?: Function): Spacial
  scale (): Vector
  scale (xOrVector?: Vector | number, y?: number, cb?: Function): Vector | Spacial {
    if (xOrVector === undefined) return this.scl.copy();
    const origin = this.scl.copy();
    if (xOrVector instanceof Vector) {
      this.scl.x = xOrVector.x;
      this.scl.y = xOrVector.y;
    } else if (y === undefined) {
      this.scl.x = xOrVector;
      this.scl.y = xOrVector;
    } else {
      this.scl.x = xOrVector;
      this.scl.y = y;
    }
    // Cap the scale factor to upper and lower bounds
    if (Math.abs(this.scl.x) > this.maxSize) this.scl.x = this.maxSize * (Math.sign(this.scl.x));
    if (Math.abs(this.scl.y) > this.maxSize) this.scl.y = this.maxSize * (Math.sign(this.scl.y));
    if (Math.abs(this.scl.x) < this.minSize) this.scl.x = this.minSize * (Math.sign(this.scl.x));
    if (Math.abs(this.scl.y) < this.minSize) this.scl.y = this.minSize * (Math.sign(this.scl.y));
    const delta = this.scl.minus(origin);
    for (const vertex of this.vertices) {
      vertex.scale(this.pos, delta.x, delta.y);
    }
    if (this.sprite !== null) {
      this.sprite.scale.x = this.scl.x;
      this.sprite.scale.y = this.scl.y;
    }
    if (this.debug !== null) {
      this.debug.scale.x = this.scl.x;
      this.debug.scale.y = this.scl.y;
      if (this.vdebug !== null) {
        this.vdebug.forEach((sprite, i) => {
          sprite.x = this.vertices[i].x;
          sprite.y = this.vertices[i].y;
        });
      }
    }
    if (cb !== undefined) cb();
    return this;
  }

  scaleX (val: number): Spacial
  scaleX (): number
  scaleX (val?: number): number | Spacial {
    if (val === undefined) return this.scl.x;
    this.scale(val, this.scl.y);
    return this;
  }

  scaleY (val: number): Spacial
  scaleY (): number
  scaleY (val?: number): number | Spacial {
    if (val === undefined) return this.scl.y;
    this.scale(this.scl.x, val);
    return this;
  }

  dilate (xOrVector: Vector | number, y?: number): Spacial {
    if (xOrVector instanceof Vector) {
      return this.scale(this.scl.plus(xOrVector));
    } else if (y === undefined) {
      return this.dilate(new Vector(xOrVector, xOrVector));
    } else {
      return this.scale(this.scl.x + xOrVector, this.scl.y + y);
    }
  }

  dilation (xOrVector: Vector | number, y?: number): Spacial
  dilation (): Vector
  dilation (xOrVector?: Vector | number, y?: number): Vector | Spacial {
    if (xOrVector === undefined) return this.dil.copy();
    if (xOrVector instanceof Vector) {
      this.dil.x = xOrVector.x;
      this.dil.y = xOrVector.y;
    } else if (y === undefined) {
      return this.dilation(new Vector(xOrVector, xOrVector));
    } else {
      this.dil.x = xOrVector;
      this.dil.y = y;
    }
    return this;
  }

  dilationX (val: number): number
  dilationX (): number
  dilationX (val?: number): number | Spacial {
    if (val === undefined) return this.dil.x;
    this.dilation(val, this.dil.y);
    return this;
  }

  dilationY (val: number): number
  dilationY (): number
  dilationY (val?: number): number | Spacial {
    if (val === undefined) return this.dil.y;
    this.dilation(this.dil.x, val);
    return this;
  }

  stretch (xOrVector: Vector | number, y?: number): Spacial {
    if (xOrVector instanceof Vector) {
      return this.dilation(this.dil.plus(xOrVector));
    } else if (y === undefined) {
      return this.stretch(xOrVector, xOrVector);
    } else {
      return this.dilation(this.dil.x + xOrVector, this.dil.y + y);
    }
  }

  toString (): string {
    return `Spacial[${this.id}]`;
  }
}
