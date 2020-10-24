import U from '../utilities';
import Shape from './Shapes';
import { Point, Vector, Line } from '../geom';
import { World, Watcher } from '../world';

export enum CollisionEvent {
  LEAVE = 'leave',
  ENTER = 'enter',
  COLLIDE = 'collide',
  COLLIDE_INNER = 'collide-inner',
  COLLIDE_OUTER = 'collide-outer',
}

export interface Projection {
  min: number;
  max: number;
}

export enum CollisionState {
  OUTSIDE,
  INSIDE,
  COLLIDING,
}
interface CollisionStateMap {
  [key: string]: CollisionState;
};
const states: CollisionStateMap = {};

enum SATState {
  SEPARATE,
  OVERLAPPING,
  ENCLOSED,
}

const separatingAxis = (actor: ICollidable, interactor: ICollidable): SATState => {
  const a1 = actor.axes(interactor);
  const a2 = interactor.axes(actor);
  let enclosed = true;
  for (const axis of a1) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SATState.SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  for (const axis of a2) {
    const p1 = actor.project(axis);
    const p2 = interactor.project(axis);
    if (p1.min > p2.max || p2.min > p1.max) return SATState.SEPARATE;
    if (enclosed && (p1.min < p2.min || p1.max > p2.max)) enclosed = false;
  }

  return enclosed ? SATState.ENCLOSED : SATState.OVERLAPPING;
};

export interface CollidableOptions {
  shape: Shape;
  world?: World;
  layer?: string;
  radius?: number;
  height?: number;
  width?: number;
};

export function DCollidable () {
  return function (target: any) {
    const targetInit = Object.getOwnPropertyDescriptor(target.prototype, 'init')?.value;
    const translatableInit = Object.getOwnPropertyDescriptor(Collidable.prototype, 'init')?.value;
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
    const translatableRun = Object.getOwnPropertyDescriptor(Collidable.prototype, 'run')?.value;
    Object.defineProperty(target.prototype, 'run', {
      value: function () {
        if (targetRun !== undefined) targetRun.call(this, arguments[0]);
        if (translatableRun !== undefined) translatableRun.call(this, arguments[0]);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    });
    Object.getOwnPropertyNames(Collidable.prototype).forEach(prop => {
      if (prop !== 'constructor' && prop !== 'init' && prop !== 'run') {
        const propDefinition = Object.getOwnPropertyDescriptor(Collidable.prototype, prop);
        if (propDefinition !== undefined) Object.defineProperty(target.prototype, prop, propDefinition);
      }
    });
  };
}

export interface ICollidable {
  id: string;
  collidable: boolean;
  shape: Shape;
  world: World;
  layer: string;
  watchers: { [key: string]: Watcher; };
  pos: Point;
  vertices: Point[];
  run: (delta: number) => void;
  destroy: () => void;
  on: (event: CollisionEvent, cb: () => void, interactor: string) => any;
  off: (event: CollisionEvent, interactor: string) => any;
  axes: (other: ICollidable) => Vector[];
  project: (normal: Vector) => Projection;
  edges: () => Line[];
  contains: (point: Point) => boolean;
  check: (watcher: Watcher, interactor: ICollidable) => void;
  radius?: number;
  height?: number;
  width?: number;
}

export class Collidable implements ICollidable {
  id: string;
  public collidable: boolean;
  shape: Shape;
  world: World;
  layer: string;
  watchers: { [key: string]: Watcher; };
  pos: Point;
  vertices: Point[];
  radius?: number;
  height?: number;
  width?: number;

  constructor (options?: CollidableOptions) {
    this.init(options);
  }

  public init (options?: CollidableOptions): void {
    this.collidable = true;
    if (this.id === undefined) this.id = U.uuid();
    if (this.shape === undefined) this.shape = options?.shape ?? Shape.NONE;
    if (this.world === undefined) this.world = options?.world ?? new World();
    if (this.layer === undefined) this.layer = options?.layer ?? 'default';
    if (this.watchers === undefined) this.watchers = {};
    if (this.pos === undefined) this.pos = Point.Zero();
    if (this.radius === undefined) {
      this.radius = this.shape === Shape.CIRCLE
        ? (options?.radius !== undefined) ? options.radius : 1
        : undefined;
    }
    if (this.height === undefined) {
      this.height = this.shape === Shape.RECTANGLE
        ? (options?.height !== undefined) ? options.height : 1
        : undefined;
    }
    if (this.width === undefined) {
      this.width = this.shape === Shape.RECTANGLE
        ? (options?.width !== undefined) ? options.width : 1
        : undefined;
    }
    if (this.vertices === undefined) {
      const hw = (this.width ?? 1) / 2;
      const hh = (this.height ?? 1) / 2;
      switch (this.shape) {
        case Shape.RECTANGLE:
          this.vertices = [
            new Point(hw, -hh),
            new Point(hw, hh),
            new Point(-hw, hh),
            new Point(-hw, -hh),
          ];
          break;
        case Shape.CIRCLE:
          this.vertices = [Point.Zero()];
          break;
        default:
          this.vertices = [];
      }
    }
    this.world.add(this, this.layer);
  }

  public run (delta: number): void {
    if (this.collidable) {
      for (const watcher of Object.values(this.watchers)) watcher.run(delta);
    }
  };

  public destroy (): void {
    this.collidable = false;
    for (const watcher of Object.values(this.watchers)) watcher.removeAllListeners();
    this.watchers = {};
    this.world.remove(this, this.layer);
  };

  public on (event: CollisionEvent, cb: () => void, interactor: string = 'default'): Collidable {
    const id = this.world.getId(interactor);
    if (!(this.watchers[id] instanceof Watcher)) this.watchers[id] = this.world.watcher(this, interactor);
    this.watchers[id].on(event, cb);
    return this;
  };

  public off (event: CollisionEvent, interactor: string = 'default'): Collidable {
    const id = this.world.getId(interactor);
    if (this.watchers[id] instanceof Watcher) this.watchers[id].removeAllListeners(event);
    return this;
  };

  // == axes == //
  public axes (other: ICollidable): Vector[] {
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
  };

  // == project == //
  public project (normal: Vector): Projection {
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
  };

  // == edges == //
  public edges (): Line[] {
    const edges: Line[] = [];
    if (this.vertices.length < 3) return edges;
    for (let i = 1; i < this.vertices.length; i++) {
      edges.push(new Line(this.vertices[i - 1], this.vertices[i]));
    }
    edges.push(new Line(this.vertices[this.vertices.length - 1], this.vertices[0]));
    return edges;
  }

  // == contains == //
  contains (point: Point): boolean {
    if (this.shape === Shape.CIRCLE && this.radius !== undefined) {
      return this.pos.distance(point) <= this.radius;
    }
    let cross = 0;
    const cast = new Line(point, new Point(Number.MAX_SAFE_INTEGER, point.y));
    for (const edge of this.edges()) {
      if (edge.crosses(cast)) cross++;
    }
    const value = cross % 2 === 1;
    return value;
  };

  // == check == //
  check (watcher: Watcher, interactor: ICollidable): void {
    if (this.shape === Shape.NONE || interactor.shape === Shape.NONE) return;
    const key = [this.id, interactor.id].sort((a: any, b: any) => a - b).join('-');
    const last = states[key];
    const distance = this.pos.distance(interactor.pos);
    switch (this.shape) {
      case Shape.RECTANGLE:
        switch (interactor.shape) {
          // == Rectange - Rectangle == //
          case Shape.RECTANGLE:
            // TODO: Hypotenus checking optimization?
            switch (separatingAxis(this, interactor)) {
              case SATState.SEPARATE:
                states[key] = CollisionState.OUTSIDE;
                if (last !== CollisionState.OUTSIDE) watcher.emit(CollisionEvent.LEAVE, this, interactor);
                break;
              case SATState.ENCLOSED:
                states[key] = CollisionState.INSIDE;
                if (last !== CollisionState.INSIDE) watcher.emit(CollisionEvent.ENTER, this, interactor);
                break;
              case SATState.OVERLAPPING:
                states[key] = CollisionState.COLLIDING;
                if (last !== CollisionState.COLLIDING) watcher.emit(CollisionEvent.COLLIDE, this, interactor);
                if (last === CollisionState.INSIDE) watcher.emit(CollisionEvent.COLLIDE_INNER, this, interactor);
                if (last === CollisionState.OUTSIDE) watcher.emit(CollisionEvent.COLLIDE_OUTER, this, interactor);
            }

            break;
          // == Rectange - Circle == //
          case Shape.CIRCLE:
            // == NO OP == //
            break;
        }
        break;
      case Shape.CIRCLE:
        switch (interactor.shape) {
          // == Circle - Rectangle == //
          case Shape.RECTANGLE:
            // == NO OP == //
            break;
          // == Circle - Circle == //
          case Shape.CIRCLE:
            if (this.radius === undefined || interactor.radius === undefined) break;
            if (distance > (this.radius + interactor.radius)) {
              // actor is outside of interactor
              states[key] = CollisionState.OUTSIDE;
              if (last !== CollisionState.OUTSIDE) watcher.emit(CollisionEvent.LEAVE, this, interactor);
            } else if (distance < Math.abs(this.radius - interactor.radius)) {
              // actor is entirely inside interactor
              states[key] = CollisionState.INSIDE;
              if (last !== CollisionState.INSIDE) watcher.emit(CollisionEvent.ENTER, this, interactor);
            } else {
              // actor is crossing borders with interactor
              states[key] = CollisionState.COLLIDING;
              if (last !== CollisionState.COLLIDING) watcher.emit(CollisionEvent.COLLIDE, this, interactor);
              if (last === CollisionState.INSIDE) watcher.emit(CollisionEvent.COLLIDE_INNER, this, interactor);
              if (last === CollisionState.OUTSIDE) watcher.emit(CollisionEvent.COLLIDE_OUTER, this, interactor);
            }
            break;
        }
        break;
    }
  }
}
