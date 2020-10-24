import U from '../utilities';
import { Point } from '../geom';

export interface RotatableOptions {
  maxRotation?: number;
  minRotation?: number;
};

export function DRotatable () {
  return function (target: any) {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Rotatable.prototype, 'init')?.value;
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
    const translatableRun = Object.getOwnPropertyDescriptor(Rotatable.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Rotatable.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Rotatable.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
  };
}

export interface IRotatable {
  id: string;
  rotatable: boolean;
  maxRotation: number;
  minRotation: number;
  vertices: Point[];
  pos: Point;
  ang: number;
  rot: number;
  init: (options?: any) => void;
  run: (delta: number) => void;
  destroy: () => void;
  onRotate: (angle: number, delta: number, origin: number) => void;
}

export class Rotatable implements IRotatable {
  id: string;
  public rotatable: boolean;
  public maxRotation: number;
  public minRotation: number;
  vertices: Point[];
  pos: Point;
  ang: number;
  rot: number;

  constructor (options?: RotatableOptions) {
    this.init(options);
  }

  public init (options?: RotatableOptions): void {
    this.rotatable = true;
    if (this.id === undefined) this.id = U.uuid();
    if (this.maxRotation === undefined) this.maxRotation = options?.maxRotation ?? Infinity;
    if (this.minRotation === undefined) this.minRotation = options?.minRotation ?? 0;
    if (this.vertices === undefined) this.vertices = [];
    if (this.pos === undefined) this.pos = Point.Zero();
    if (this.ang === undefined) this.ang = 0;
    if (this.rot === undefined) this.rot = 0;
  }

  public run (delta: number): void {
    if (this.rotatable) {
      this.rotate(this.rot);
    }
  };

  public destroy (): void {
    this.rotatable = false;
    this.vertices = [];
  }

  public onRotate (angle: number, delta: number, origin: number): void {
    U.log(`[ROTATION ${this.id}] ${origin} = ${delta} => ${angle}`, 'verbose');
  };

  // == angle == //
  public angle (degree: number): Rotatable
  public angle (): number
  public angle (degree?: number): number|Rotatable {
    if (degree === undefined) return U.clampAngle(this.ang);
    const origin = this.ang;
    this.ang = U.clampAngle(degree);
    const delta = this.ang - origin;
    for (const vertex of this.vertices) {
      vertex.rotate(this.pos, delta);
    }
    this.onRotate(
      this.ang,
      delta,
      origin,
    );
    return this;
  };

  // == rotate == //
  public rotate (degree: number): Rotatable {
    this.angle(this.ang + degree);
    return this;
  };

  // == rotation == //
  public rotation (degree: number): Rotatable
  public rotation (): number
  public rotation (degree?: number): number|Rotatable {
    if (degree === undefined) return this.rot;
    this.rot = degree;
    // Cap the rotation to upper and lower bounds
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
    if (Math.abs(this.rot) < this.minRotation) this.rotation(this.minRotation * Math.sign(this.rot));
    return this;
  };

  // == spin == //
  public spin (degree: number): Rotatable {
    this.rotation(this.rot + degree);
    return this;
  };
}
