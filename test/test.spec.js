import U from '../src/utilities';
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node'
};

describe('Bogie Tests', function () {
  before(function () {
    U.log('Starting Tests', 'info');
  });
  after(function () {
    U.log('All Unit Tests Complete', 'info');
  });
  describe('Unit Tests', function () {
    require('./geom');
    require('./physics');
  });
});
