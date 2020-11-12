import {
  ICollidable,
  CollidableOptions,
  IDebuggable,
  DebuggableOptions,
  TranslatableOptions,
  ITranslatable,
  IRotatable,
  RotatableOptions,
  IScalable,
  ScalableOptions,
} from './';

import { Translatable } from './Translatable';
import { Rotatable } from './Rotatable';
import { Scalable } from './Scalable';
import { Collidable } from './Collidable';
import { Debuggable } from './Debuggable';

enum Shape {
  NONE = 'none',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
}
export default Shape;

interface SpacialOptions extends TranslatableOptions, RotatableOptions, ScalableOptions, DebuggableOptions, CollidableOptions {};
export interface Spacial extends ITranslatable, IRotatable, IScalable, IDebuggable, ICollidable {}

function Attribute (Base: any) {
  return (target: any): any => {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Base.prototype, 'init')?.value;
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
    const translatableRun = Object.getOwnPropertyDescriptor(Base.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Base.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Base.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
    return target;
  };
}

@Attribute(Translatable)
@Attribute(Rotatable)
@Attribute(Scalable)
@Attribute(Collidable)
@Attribute(Debuggable)
export class Spacial {
  init: (options?: SpacialOptions) => void;
  constructor (options?: SpacialOptions) {
    this.init(options);
  }

  toString (): string {
    switch (this.shape) {
      case Shape.RECTANGLE:
        return `Rectangle[${this.id}]`;
      case Shape.CIRCLE:
        return `Circle[${this.id}]`;
      case Shape.NONE:
      default:
        return `Spacial[${this.id}]`;
    }
  }
}
