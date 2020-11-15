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

import Attribute from './Attribute';
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
interface ShapeOptions extends Omit<SpacialOptions, 'shape'> { shape?: any; }
export interface Spacial extends ITranslatable, IRotatable, IScalable, IDebuggable, ICollidable {}
export interface Rectangle extends Spacial {}
export interface Circle extends Spacial {}

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

export class Rectangle extends Spacial {
  constructor (options?: ShapeOptions) {
    if (options === undefined) {
      options = { shape: Shape.RECTANGLE };
    } else {
      options.shape = Shape.RECTANGLE;
    }
    super(options as SpacialOptions);
  }

  toString (): string {
    return `Rectangle[${this.id}]`;
  }
}

export class Circle extends Spacial {
  constructor (options?: ShapeOptions) {
    if (options === undefined) {
      options = { shape: Shape.CIRCLE };
    } else {
      options.shape = Shape.CIRCLE;
    }
    super(options as SpacialOptions);
  }

  toString (): string {
    return `Circle[${this.id}]`;
  }
}
