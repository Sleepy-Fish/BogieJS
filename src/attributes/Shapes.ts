import {
  ICollidable,
  DCollidable,
  CollidableOptions,
  IDebuggable,
  DDebuggable,
  DebuggableOptions,
  TranslatableOptions,
  ITranslatable,
  DTranslatable,
  IRotatable,
  DRotatable,
  RotatableOptions,
  IScalable,
  DScalable,
  ScalableOptions,
} from '.';

enum Shape {
  NONE = 'none',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
}
export default Shape;

interface SpacialOptions extends TranslatableOptions, RotatableOptions, ScalableOptions, DebuggableOptions, CollidableOptions {};
export interface Spacial extends ITranslatable, IRotatable, IScalable, IDebuggable, ICollidable {}
@DTranslatable()
@DRotatable()
@DScalable()
@DDebuggable()
@DCollidable()
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
