import U from '../test.utilities';
import { Rectangle, Circle } from '../../src/geom';
import { World } from '../../src/physics';

describe('World', function () {
  describe('collision', function () {
    it('perform rectangle-rectangle collisions', function () {
      const world = new World();
      const actor = new Rectangle({
        height: 10,
        width: 10,
      })
        .position(0, 0)
        .makeCollidable(world);

      const interactor = new Rectangle({
        height: 20,
        width: 20,
      })
        .position(100, 100)
        .makeCollidable(world);

      const expected = [
        'leave',
        'collide',
        'collide-outer',
        'enter',
        'collide',
        'collide-inner',
        'leave',
      ];
      const events = [];

      actor.on('enter', () => {
        events.push('enter');
      }, interactor);
      actor.on('leave', () => {
        events.push('leave');
      }, interactor);
      actor.on('collide', () => {
        events.push('collide');
      }, interactor);
      actor.on('collide-inner', () => {
        events.push('collide-inner');
      }, interactor);
      actor.on('collide-outer', () => {
        events.push('collide-outer');
      }, interactor);

      actor.run();
      interactor.run();

      actor.position(85, 85);

      actor.run();
      interactor.run();

      actor.position(100, 100);

      actor.run();
      interactor.run();

      actor.position(115, 115);

      actor.run();
      interactor.run();

      actor.position(200, 200);

      actor.run();
      interactor.run();

      U.assert(events.length, expected.length);
      for (const i in expected) {
        U.assert(events[i], expected[i]);
      }
    });
    it('perform circle-circle collisions', function () {
      const world = new World();
      const actor = new Circle({
        radius: 10,
      })
        .position(0, 0)
        .makeCollidable(world);

      const interactor = new Circle({
        radius: 20,
      })
        .position(100, 100)
        .makeCollidable(world);

      const expected = [
        'leave',
        'collide',
        'collide-outer',
        'enter',
        'collide',
        'collide-inner',
        'leave',
      ];
      const events = [];

      actor.on('enter', () => {
        events.push('enter');
      }, interactor);
      actor.on('leave', () => {
        events.push('leave');
      }, interactor);
      actor.on('collide', () => {
        events.push('collide');
      }, interactor);
      actor.on('collide-inner', () => {
        events.push('collide-inner');
      }, interactor);
      actor.on('collide-outer', () => {
        events.push('collide-outer');
      }, interactor);

      actor.run();
      interactor.run();

      actor.position(85, 85);

      actor.run();
      interactor.run();

      actor.position(100, 100);

      actor.run();
      interactor.run();

      actor.position(115, 115);

      actor.run();
      interactor.run();

      actor.position(200, 200);

      actor.run();
      interactor.run();

      U.assert(events.length, expected.length);
      for (const i in expected) {
        U.assert(events[i], expected[i]);
      }
    });
  });
});
