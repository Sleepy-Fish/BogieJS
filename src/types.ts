import Spacial from './geom/Spacial';
import { Rectangle, Circle } from './geom';

export enum CollisionEvent {
  LEAVE = 'leave',
  ENTER = 'enter',
  COLLIDE = 'collide',
  COLLIDE_INNER = 'collide-inner',
  COLLIDE_OUTER = 'collide-outer',
}

export type Collidable = (Spacial|Rectangle|Circle);
