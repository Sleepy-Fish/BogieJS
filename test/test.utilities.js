
import { strict as assert } from 'assert';
import path from 'path';
import U from '../src/utilities';

const _assert = (v1, v2 = null, o = {}) => {
  if (typeof o !== 'object') throw Error('FUCK');
  const msg = o.msg ? ` - \x1b[34m${o.msg}\x1b[0m` : '';
  if (v2 === null) {
    U.log(`Assert: ${v1}${msg}`, 'debug');
    assert(v1);
  } else {
    U.log(`Assert: ${v1} ${o.not ? '!' : '='}== ${v2} (${o.precision || ''})${msg}`, 'debug');
    if (Number.isInteger(o.precision)) {
      if (o.not) {
        assert.notStrictEqual(U.fix(v1, o.precision), U.fix(v2, o.precision));
      } else {
        assert.strictEqual(U.fix(v1, o.precision), U.fix(v2, o.precision));
      }
    } else if (o.not) {
      assert.notStrictEqual(v1, v2);
    } else {
      assert.strictEqual(v1, v2);
    }
  }
};

const _rndBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const _root = function (str) {
  return path.join(__dirname, '..', str);
};

export default Object.assign(U, {
  assert: _assert,
  rndBetween: _rndBetween,
  root: _root,
});
