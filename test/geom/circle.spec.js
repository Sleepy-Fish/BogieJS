import U from '../test.utilities';
import { Point } from '../../src/geom';
import { Spacial } from '../../src/attributes/Shapes';

describe('Circle', function () {
  // ** --- Geometry Functions --- ** //
  describe('geometry', function () {
    it('should determine if circle contains point', function () {
      const circle = new Spacial({
        shape: 'circle',
        radius: 10,
      })
        .position(100, 100);

      const outside = [
        new Point(0, 0),
        new Point(100, 0),
        new Point(0, 100),
        new Point(100, 89.9),
        new Point(100, 110.1),
        new Point(89.9, 100),
        new Point(110.1, 100),
      ];
      const inside = [
        new Point(100, 100),
        new Point(95, 100),
        new Point(100, 95),
        new Point(100, 90),
        new Point(100, 110),
        new Point(90, 100),
        new Point(110, 100),
      ];

      for (const point of outside) {
        U.assert(!circle.contains(point), null, {
          msg: `${circle} doesn't contain ${point}`,
        });
      }
      for (const point of inside) {
        U.assert(circle.contains(point), null, {
          msg: `${circle} contains ${point}`,
        });
      }
    });
  });
});
