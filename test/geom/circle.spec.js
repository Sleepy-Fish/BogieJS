const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;

const U = require('../test.utilities').default;

describe('Circle', function () {
  // ** --- Utility Functions --- ** //
  describe('utilities', function () {
    U.assert(true);
  });
  // ** --- Event Functions --- ** //
  describe('events', function () {
    it('should register and trigger collision events', function () {
      U.assert(true);
    });
    it('should collide properly with other circles', function () {
      U.assert(true);
    });
    it.skip('should collide properly with rectangles', function () {
      U.assert(true);
    });
  });
  // ** --- Translate Functions --- ** //
  describe('translation', function () {
    U.assert(true);
  });
  // ** --- Rotate Functions --- ** //
  describe('rotation', function () {
    U.assert(true);
  });
  // ** --- Transform Functions --- ** //
  describe('transformation', function () {
    U.assert(true);
  });
});
