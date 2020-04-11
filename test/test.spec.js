import U from '../src/utilities';

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
