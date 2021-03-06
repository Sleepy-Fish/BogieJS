import * as PIXI from 'pixi.js';
import { World, Rectangle, Point, Vector, CollisionEvent } from '../../src';

export default function (app: PIXI.Application): void {
  const world = new World();
  const actor = new Rectangle({
    parent: app.stage,
    world: world,
    width: 100,
    height: 10,
  })
    .position(new Point(10, 10))
    .rotation(3);

  const interactor = new Rectangle({
    parent: app.stage,
    world: world,
    width: 350,
    height: 100,
  })
    .position(new Point(app.view.width / 2, app.view.height / 2));

  const angle = actor.position().angle(interactor.position());
  actor.velocity(Vector.Zero().magnitude(2).angle(angle));

  actor.on(CollisionEvent.ENTER, () => {
    actor.color(0x000099);
  });

  actor.on(CollisionEvent.COLLIDE, () => {
    actor.color(0x990000);
  });

  actor.on(CollisionEvent.LEAVE, () => {
    actor.color(0x009900);
  });

  actor.on(CollisionEvent.COLLIDE, () => {
    interactor.color(0x009900);
  });

  actor.on(CollisionEvent.LEAVE, () => {
    interactor.color(0x990099);
  });

  const startDistance = actor.position().distance(interactor.position());
  let spin = 0.02;
  const loop = (delta: number): void => {
    if (actor.position().distance(interactor.position()) > startDistance) {
      actor.position(new Point(10, 10));
    }
    if (interactor.rotation() > 5) {
      spin = -0.02;
    } else if (interactor.rotation() < -5) {
      spin = 0.02;
    }
    interactor.spin(spin);
    actor.run(delta);
    interactor.run(delta);
  };
  app.ticker.add(delta => loop(delta));
};

export const fnStr = `
import * as PIXI from 'pixi.js';
import { World, Rectangle, Point, Vector, CollisionEvent } from 'bogie';

let app: PIXI.Application();

// ... Setup Your PIXI app here ...

const world = new World();
const actor = new Rectangle({
  parent: app.stage,
  world: world,
  width: 100,
  height: 10,
})
  .position(new Point(10, 10))
  .rotation(3);

const interactor = new Rectangle({
  parent: app.stage,
  world: world,
  width: 350,
  height: 100,
})
  .position(new Point(app.view.width / 2, app.view.height / 2));

const angle = actor.position().angle(interactor.position());
actor.velocity(Vector.Zero().magnitude(2).angle(angle));

actor.on(CollisionEvent.ENTER, () => {
  actor.color(0x000099);
});

actor.on(CollisionEvent.COLLIDE, () => {
  actor.color(0x990000);
});

actor.on(CollisionEvent.LEAVE, () => {
  actor.color(0x009900);
});

actor.on(CollisionEvent.COLLIDE, () => {
  interactor.color(0x009900);
});

actor.on(CollisionEvent.LEAVE, () => {
  interactor.color(0x990099);
});

const startDistance = actor.position().distance(interactor.position());
let spin = 0.02;
const loop = (delta: number): void => {
  if (actor.position().distance(interactor.position()) > startDistance) {
    actor.position(new Point(10, 10));
  }
  if (interactor.rotation() > 5) {
    spin = -0.02;
  } else if (interactor.rotation() < -5) {
    spin = 0.02;
  }
  interactor.spin(spin);
  actor.run(delta);
  interactor.run(delta);
};
app.ticker.add(delta => loop(delta));

`;
