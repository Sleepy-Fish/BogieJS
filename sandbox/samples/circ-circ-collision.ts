import * as PIXI from 'pixi.js';
import { World, Spacial, Point, Vector, Shape, CollisionEvent } from '../../src';

export default function (app: PIXI.Application): void {
  const world = new World();
  const actor = new Spacial({
    shape: Shape.CIRCLE,
    parent: app.stage,
    world: world,
    radius: 10,
  })
    .position(new Point(10, 10));

  const interactor = new Spacial({
    shape: Shape.CIRCLE,
    parent: app.stage,
    world: world,
    radius: 80,
  })
    .position(new Point(app.view.width / 2, app.view.height / 2))
    .stretch(0.02);

  const angle = actor.position().angle(interactor.position());
  actor.velocity(Vector.Zero().magnitude(2).angle(angle));

  actor.on(CollisionEvent.COLLIDE, () => {
    console.log('hit');
  });

  const startDistance = actor.position().distance(interactor.position());
  const loop = (delta: number): void => {
    if (actor.position().distance(interactor.position()) > startDistance) {
      actor.position(new Point(10, 10));
    }
    if (interactor.scale().x > 3.5) {
      interactor.stretch(-0.02);
    } else if (interactor.scale().x < 0.3) {
      interactor.stretch(0.02);
    }
    actor.run(delta);
    interactor.run(delta);
  };
  app.ticker.add(delta => loop(delta));
};

export const fnStr = `
import * as PIXI from 'pixi.js';
import { World, Spacial, Point, Vector, Shape, CollisionEvent } from 'bogie';

let app: PIXI.Application();

// ... Setup Your PIXI app here ...

const world = new World();
const actor = new Spacial({
  shape: Shape.CIRCLE,
  parent: app.stage,
  world: world,
  radius: 10,
})
  .position(new Point(10, 10));

const interactor = new Spacial({
  shape: Shape.CIRCLE,
  parent: app.stage,
  world: world,
  radius: 80,
})
  .position(new Point(app.view.width / 2, app.view.height / 2))
  .stretch(0.02);

const angle = actor.position().angle(interactor.position());
actor.velocity(Vector.Zero().magnitude(2).angle(angle));

actor.on(CollisionEvent.COLLIDE, () => {
  console.log('hit');
});

const startDistance = actor.position().distance(interactor.position());
const loop = (delta: number): void => {
  if (actor.position().distance(interactor.position()) > startDistance) {
    actor.position(new Point(10, 10));
  }
  if (interactor.scale().x > 3.5) {
    interactor.stretch(-0.02);
  } else if (interactor.scale().x < 0.3) {
    interactor.stretch(0.02);
  }
  actor.run(delta);
  interactor.run(delta);
};
app.ticker.add(delta => loop(delta));

`;
