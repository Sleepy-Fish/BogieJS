import U from '../utilities';
import { Point, Vector } from '../geom';

export interface ScalableOptions {
  maxSize?: number;
  minSize?: number;
};

export function DScalable () {
  return function (target: any) {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Scalable.prototype, 'init')?.value;
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
    const translatableRun = Object.getOwnPropertyDescriptor(Scalable.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Scalable.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Scalable.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
  };
}

export interface IScalable {
  id: string;
  scalable: boolean;
  maxSize: number;
  minSize: number;
  vertices: Point[];
  pos: Point;
  scl: Vector;
  dil: Vector;
  init: (options?: any) => void;
  run: (delta: number) => void;
  destroy: () => void;
  onScale: (scale: Vector, delta: Vector, origin: Vector) => void;
}

export class Scalable implements IScalable {
  id: string;
  public scalable: boolean;
  public maxSize: number;
  public minSize: number;
  vertices: Point[];
  pos: Point;
  scl: Vector;
  dil: Vector;

  constructor (options?: ScalableOptions) {
    this.init(options);
  }

  public init (options?: ScalableOptions): void {
    this.scalable = true;
    if (this.id === undefined) this.id = U.uuid();
    if (this.maxSize === undefined) this.maxSize = options?.maxSize ?? Infinity;
    if (this.minSize === undefined) this.minSize = options?.minSize ?? 0;
    if (this.vertices === undefined) this.vertices = [];
    if (this.pos === undefined) this.pos = Point.Zero();
    if (this.scl === undefined) this.scl = Vector.Zero();
    if (this.dil === undefined) this.dil = Vector.Zero();
  }

  public run (delta: number): void {
    if (this.scalable) {
      this.dilate(this.dil);
    }
  };

  public destroy (): void {
    this.scalable = false;
    this.vertices = [];
  }

  public onScale (scale: Vector, delta: Vector, origin: Vector): void {
    U.log(`[DILATION ${this.id}] (${origin.x}, ${origin.y}) = (${delta.x}, ${delta.y}) => (${scale.x}, ${scale.y})`, 'verbose');
  }

  // == scale == //
  public scale (xOrVector: Vector | number, y?: number, cb?: Function): Scalable
  public scale (): Vector
  public scale (xOrVector?: Vector | number, y?: number, cb?: Function): Vector|Scalable {
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
    this.onScale(this.scl, delta, origin);
    return this;
  };

  public scaleX (val: number): Scalable
  public scaleX (): number
  public scaleX (val?: number): number|Scalable {
    if (val === undefined) return this.scl.x;
    this.scale(val, this.scl.y);
    return this;
  };

  public scaleY (val: number): Scalable
  public scaleY (): number
  public scaleY (val?: number): number|Scalable {
    if (val === undefined) return this.scl.y;
    this.scale(this.scl.x, val);
    return this;
  };

  public dilate (xOrVector: Vector | number, y?: number): Scalable {
    if (xOrVector instanceof Vector) {
      return this.scale(this.scl.plus(xOrVector));
    } else if (y === undefined) {
      return this.dilate(new Vector(xOrVector, xOrVector));
    } else {
      return this.scale(this.scl.x + xOrVector, this.scl.y + y);
    }
  };

  public dilation (xOrVector: Vector | number, y?: number): Scalable
  public dilation (): Vector
  public dilation (xOrVector?: Vector | number, y?: number): Vector|Scalable {
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
  };

  public dilationX (val: number): number
  public dilationX (): number
  public dilationX (val?: number): number|Scalable {
    if (val === undefined) return this.dil.x;
    this.dilation(val, this.dil.y);
    return this;
  };

  public dilationY (val: number): number
  public dilationY (): number
  public dilationY (val?: number): number|Scalable {
    if (val === undefined) return this.dil.y;
    this.dilation(this.dil.x, val);
    return this;
  };

  public stretch (xOrVector: Vector | number, y?: number): Scalable {
    if (xOrVector instanceof Vector) {
      return this.dilation(this.dil.plus(xOrVector));
    } else if (y === undefined) {
      return this.stretch(xOrVector, xOrVector);
    } else {
      return this.dilation(this.dil.x + xOrVector, this.dil.y + y);
    }
  };
}
