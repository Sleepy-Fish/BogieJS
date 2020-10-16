import Spacial from './Spacial';

export interface SpacialOptions {
  parent: Spacial|null;
  maxSpeed?: number;
  minSpeed?: number;
  maxRotation?: number;
  minRotation?: number;
  maxSize?: number;
  minSize?: number;
  lockVelocityToAngle: boolean;
};

export interface RectangleOptions extends SpacialOptions {
  height?: number;
  width?: number;
};

export interface CircleOptions extends SpacialOptions {
  radius?: number;
};

export interface Projection {
  min: number;
  max: number;
}
