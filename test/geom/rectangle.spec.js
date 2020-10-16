import U from '../test.utilities';
import { Rectangle, Point } from '../../src/geom';

describe('Rectangle', function () {
  // ** --- Geometry Functions --- ** //
  describe('geometry', function () {
    it('should determine if rectangle contains point', function () {
      const rect = new Rectangle({
        width: 10,
        height: 10,
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
        new Point(95.1, 100),
        new Point(100, 95.1),
        new Point(100, 104.9),
        new Point(104.9, 100),
      ];

      for (const point of outside) {
        U.assert(!rect.contains(point));
      }
      for (const point of inside) {
        U.assert(rect.contains(point));
      }
    });
  });
});
