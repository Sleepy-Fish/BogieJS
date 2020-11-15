import * as PIXI from 'pixi.js';
import { World, Circle, Point, CollisionEvent } from '../../src';

export default function (app: PIXI.Application): void {
  const world = new World();
  const actor = new Circle({
    parent: app.stage,
    world: world,
    radius: 10,
  })
    .position(new Point(10, 10))
    .velocity(2, 2);

  const interactor = new Circle({
    parent: app.stage,
    world: world,
    radius: 80,
  })
    .position(new Point(app.view.width / 2, app.view.height / 2))
    .stretch(0.02);

  actor.on(CollisionEvent.ENTER, () => {
    actor.color(0x0000ff);
    console.log('enter');
  });

  actor.on(CollisionEvent.COLLIDE, () => {
    console.log('collide');
  });

  actor.on(CollisionEvent.LEAVE, () => {
    console.log('leave');
  });

  const loop = (delta: number): void => {
    const x = actor.x();
    const y = actor.y();
    if (x < 0) {
      actor.velocityX(2);
    } else if (x > app.screen.width) {
      actor.velocityX(-2);
    }
    if (y < 0) {
      actor.velocityY(2);
    } else if (y > app.screen.height) {
      actor.velocityY(-2);
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
import { World, Circle, Point, CollisionEvent } from 'bogie';

let app: PIXI.Application();

// ... Setup Your PIXI app here ...

const world = new World();
const actor = new Circle({
  parent: app.stage,
  world: world,
  radius: 10,
})
  .position(new Point(10, 10))
  .velocity(2, 2);

const interactor = new Circle({
  parent: app.stage,
  world: world,
  radius: 80,
})
  .position(new Point(app.view.width / 2, app.view.height / 2))
  .stretch(0.02);

actor.on(CollisionEvent.ENTER, () => {
  actor.color(0x0000ff);
  console.log('enter');
});

actor.on(CollisionEvent.COLLIDE, () => {
  console.log('collide');
});

actor.on(CollisionEvent.LEAVE, () => {
  console.log('leave');
});

const loop = (delta: number): void => {
  const x = actor.x();
  const y = actor.y();
  if (x < 0) {
    actor.velocityX(2);
  } else if (x > app.screen.width) {
    actor.velocityX(-2);
  }
  if (y < 0) {
    actor.velocityY(2);
  } else if (y > app.screen.height) {
    actor.velocityY(-2);
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
