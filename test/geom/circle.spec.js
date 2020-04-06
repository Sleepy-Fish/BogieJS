const assert = require('assert');

describe('Circle', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.strictEqual('circle'.indexOf('l'), 4);
    });
  });
});
