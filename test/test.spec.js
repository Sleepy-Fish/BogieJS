import U from './test.utilities';
import classList from '../../classList.json';
import { JSDOM } from 'jsdom';
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node',
};

const arg = process.argv.pop();
const cls = classList[arg];

if (cls) {
  describe(`${arg} Tests`, function () {
    require(U.root(cls.test));
  });
} else {
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
}
