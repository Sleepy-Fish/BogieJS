
import { strict as assert } from 'assert';
import path from 'path';
import U from '../src/utilities';

const _assert = (v1, v2 = null, o = {}) => {
  if (typeof o !== 'object') throw Error('FUCK');
  if (v2 === null) {
    U.log(`Assert: ${v1}`, 'debug');
    assert(v1);
  } else {
    U.log(`Assert: ${v1} === ${v2} (${o.precision || ''})`, 'debug');
    if (Number.isInteger(o.precision)) {
      assert.strictEqual(U.fix(v1, o.precision), U.fix(v2, o.precision));
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
