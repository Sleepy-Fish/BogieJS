import Spacial from '../geom/Spacial';
import { CollisionEvent, Collidable } from '../types';
import { Rectangle, Circle } from '../geom';
import Watcher from './Watcher';
const SEPARATE = 0;
const OVERLAPPING = 1;
const ENCLOSED = 2;

const separatingAxis = (actor: Spacial, interactor: Spacial): number => {
  const a1 = actor.axes(interactor);
  const a2 = interactor.axes(actor);
  let enclosed = true;
  for (const axis of a1) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  for (const axis of a2) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  return enclosed ? ENCLOSED : OVERLAPPING;
};

enum State {
  OUTSIDE,
  INSIDE,
  COLLIDING,
}
interface StateMap {
  [key: string]: State;
};
const states: StateMap = {};

interface CollisionMap {
  [key: string ]: {
    [key: string ]: (e: Watcher, actor: Collidable, interactor: Collidable) => void;
  };
};

const collisions: CollisionMap = {
  rectangle: {
    rectangle: (e: Watcher, actor: Rectangle, interactor: Rectangle) => {
      const distance = actor.position().distance(interactor.position());
      const key = `${actor.id}-${interactor.id}`;
      const last = states[key];
      // It's impossible to have a collision at this range
      if (distance > actor.hypotenus + interactor.hypotenus) {
        states[key] = State.OUTSIDE;
        if (last !== State.OUTSIDE) e.emit(CollisionEvent.LEAVE, actor, interactor);
      } else {
        switch (separatingAxis(actor, interactor)) {
          case SEPARATE:
            states[key] = State.OUTSIDE;
            if (last !== State.OUTSIDE) e.emit(CollisionEvent.LEAVE, actor, interactor);
            break;
          case ENCLOSED:
            states[key] = State.INSIDE;
            if (last !== State.INSIDE) e.emit(CollisionEvent.ENTER, actor, interactor);
            break;
          case OVERLAPPING:
            states[key] = State.COLLIDING;
            if (last !== State.COLLIDING) e.emit(CollisionEvent.COLLIDE, actor, interactor);
            if (last === State.INSIDE) e.emit(CollisionEvent.COLLIDE_INNER, actor, interactor);
            if (last === State.OUTSIDE) e.emit(CollisionEvent.COLLIDE_OUTER, actor, interactor);
        }
      }
    },
    circle: (e: Watcher, actor: Rectangle, interactor: Circle) => { /* NO-OP */ },
  },
  circle: {
    rectangle: (e: Watcher, actor: Circle, interactor: Rectangle) => { /* NO-OP */ },
    circle: (e: Watcher, actor: Circle, interactor: Circle) => {
      const distance = actor.position().distance(interactor.position());
      const key = `${actor.id}-${interactor.id}`;
      const last = states[key];
      if (distance > (actor.radius + interactor.radius)) {
        // actor is outside of interactor
        states[key] = State.OUTSIDE;
        if (last !== State.OUTSIDE) e.emit(CollisionEvent.LEAVE, actor, interactor);
      } else if (distance < Math.abs(actor.radius - interactor.radius)) {
        // actor is entirely inside interactor
        states[key] = State.INSIDE;
        if (last !== State.INSIDE) e.emit(CollisionEvent.ENTER, actor, interactor);
      } else {
        // actor is crossing borders with interactor
        states[key] = State.COLLIDING;
        if (last !== State.COLLIDING) e.emit(CollisionEvent.COLLIDE, actor, interactor);
        if (last === State.INSIDE) e.emit(CollisionEvent.COLLIDE_INNER, actor, interactor);
        if (last === State.OUTSIDE) e.emit(CollisionEvent.COLLIDE_OUTER, actor, interactor);
      }
    },
  },
};

export default collisions;
