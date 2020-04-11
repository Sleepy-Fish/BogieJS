const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;

const U = require('../test.utilities').default;
const Geom = require('../../src/geom');
const Physics = require('../../src/physics');

describe('Array', function () {
  describe('unimplement', function () {
    it('should do anything', function () {
      U.log(Geom);
      U.log(Physics);
    });
  });
});
