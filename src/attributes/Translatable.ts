import U from '../utilities';
import { Point, Vector } from '../geom';

export interface TranslatableOptions {
  maxSpeed?: number;
  minSpeed?: number;
};

export function DTranslatable () {
  return function (target: any) {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Translatable.prototype, 'init')?.value;
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
    const translatableRun = Object.getOwnPropertyDescriptor(Translatable.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Translatable.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Translatable.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
  };
}

export interface ITranslatable {
  id: string;
  translatable: boolean;
  maxSpeed: number;
  minSpeed: number;
  vertices: Point[];
  pos: Point;
  vel: Vector;
  init: (options?: any) => void;
  run: (delta: number) => void;
  destroy: () => void;
  onTranslate: (position: Point, delta: Point, origin: Point) => void;
}

export class Translatable implements ITranslatable {
  id: string;
  public translatable: boolean;
  public maxSpeed: number;
  public minSpeed: number;
  vertices: Point[];
  pos: Point;
  vel: Vector;

  constructor (options?: TranslatableOptions) {
    this.init(options);
  }

  public init (options?: TranslatableOptions): void {
    this.translatable = true;
    if (this.id === undefined) this.id = U.uuid();
    if (this.maxSpeed === undefined) this.maxSpeed = options?.maxSpeed ?? Infinity;
    if (this.minSpeed === undefined) this.minSpeed = options?.minSpeed ?? 0;
    if (this.vertices === undefined) this.vertices = [];
    if (this.pos === undefined) this.pos = Point.Zero();
    if (this.vel === undefined) this.vel = Vector.Zero();
    // Velocity needs to be called at least once
    if (this.minSpeed !== 0) this.velocity(Vector.Zero());
  }

  public run (delta: number): void {
    if (this.translatable) {
      this.shift(this.vel);
    }
  };

  public destroy (): void {
    this.translatable = false;
    this.vertices = [];
  };

  public onTranslate (position: Point, delta: Point, origin: Point): void {
    U.log(`[TRANSLATION ${this.id}] (${origin.x}, ${origin.y}) = (${delta.x}, ${delta.y}) => (${position.x}, ${position.y})`, 'verbose');
  }

  // == position == //
  public position (xOrPoint: Point|number, y?: number): Translatable;
  public position (): Point;
  public position (xOrPoint?: Point|number, y?: number): Point|Translatable {
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
    const delta = new Point(this.pos.x - origin.x, this.pos.y - origin.y);
    for (const vertex of this.vertices) {
      vertex.translate(delta.x, delta.y);
    }
    this.onTranslate(this.pos, delta, origin);
    return this;
  };

  // == x == //
  public x (val: number): Translatable;
  public x (): number;
  public x (val?: number): number|Translatable {
    if (val === undefined) return this.pos.x;
    return this.position(val, this.pos.y);
  };

  // == y == //
  public y (val: number): Translatable;
  public y (): number;
  public y (val?: number): number|Translatable {
    if (val === undefined) return this.pos.y;
    return this.position(this.pos.x, val);
  };

  // == shift == //
  public shift (xOrVector: Vector|number, y?: number): Translatable {
    if (xOrVector instanceof Vector) {
      return this.position(this.pos.x + xOrVector.x, this.pos.y + xOrVector.y);
    } else if (y === undefined) {
      return this.shift(xOrVector, xOrVector);
    } else {
      return this.position(this.pos.x + xOrVector, this.pos.y + y);
    }
  };

  // == velocity == //
  public velocity (xOrVector: Vector|number, y?: number): Translatable
  public velocity (): Vector;
  public velocity (xOrVector?: Vector|number, y?: number): Vector|Translatable {
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
  };

  // == velocityX == //
  public velocityX (val: number): Translatable;
  public velocityX (): number;
  public velocityX (val?: number): number|Translatable {
    if (val === undefined) return this.vel.x;
    return this.velocity(val, this.vel.y);
  };

  // == velocityY == //
  public velocityY (val: number): Translatable;
  public velocityY (): number;
  public velocityY (val?: number): number|Translatable {
    if (val === undefined) return this.vel.y;
    return this.velocity(this.vel.x, val);
  };

  // == accelerate == //
  public accelerate (xOrVector: Vector|number, y?: number): Translatable {
    if (xOrVector instanceof Vector) {
      return this.velocity(this.vel.plus(xOrVector));
    } else if (y === undefined) {
      return this.accelerate(xOrVector, xOrVector);
    } else {
      return this.velocity(this.vel.x + xOrVector, this.vel.y + y);
    }
  };
}
