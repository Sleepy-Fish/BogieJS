import U from '../test.utilities';
import { Spacial } from '../../src/attributes/Shapes';
import { World } from '../../src/world';

describe('World', function () {
  describe('collision', function () {
    it('should perform rectangle-rectangle collisions', function () {
      const world = new World();
      const actor = new Spacial({
        shape: 'rectangle',
        height: 10,
        width: 10,
        world: world,
      })
        .position(0, 0);

      const interactor = new Spacial({
        shape: 'rectangle',
        height: 20,
        width: 20,
        world: world,
      })
        .position(100, 100);

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
    it('should perform circle-circle collisions', function () {
      const world = new World();
      const actor = new Spacial({
        shape: 'circle',
        radius: 10,
        world: world,
      })
        .position(0, 0);

      const interactor = new Spacial({
        shape: 'circle',
        radius: 20,
        world: world,
      })
        .position(100, 100);

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
