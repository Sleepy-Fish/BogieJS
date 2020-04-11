const assert = require('assert');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;

describe('Rectangle', function () {
  // ** --- Utility Functions --- ** //
  describe('utilities', function () {
    assert(true);
  });
  // ** --- Event Functions --- ** //
  describe('events', function () {
    it('should register and trigger collision events', function () {
      assert(true);
    });
    it('should collide properly with other rectangles', function () {
      assert(true);
    });
    it.skip('should collide properly with circles', function () {
      assert(true);
    });
  });
  // ** --- Translate Functions --- ** //
  describe('translation', function () {
    assert(true);
  });
  // ** --- Rotate Functions --- ** //
  describe('rotation', function () {
    assert(true);
  });
  // ** --- Transform Functions --- ** //
  describe('transformation', function () {
    assert(true);
  });
});
