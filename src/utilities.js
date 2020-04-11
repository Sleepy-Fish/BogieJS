import C, { levels, colors } from './constants';

const _log = (msg, level = levels.INFO) => {
  let key = null;
  if (typeof (level) === 'string') {
    key = level.toUpperCase();
    level = levels[key];
  } else {
    key = Object.keys(levels).find(k => levels[k] === level);
  }
  if (level >= C.LEVEL) console.info(colors[key], `${key}:`, msg);
};

const _toDeg = (rad) => {
  return _clampAngle(rad * (180 / Math.PI));
};

const _toRad = (deg) => {
  return deg * (Math.PI / 180);
};

const _fix = (value, precision = C.PRECISION) => {
  return Number(value.toFixed(precision));
};

const _clampAngle = (angle) => {
  if (angle > 360) return _clampAngle(angle - 360);
  if (angle < 0) return _clampAngle(angle + 360);
  return angle;
};

const _uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const replace = Math.random() * 16 | 0;
    const output = (char === 'x') ? replace : (replace & 0x3 | 0x8);
    return output.toString(16);
  });
};

const _rndBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const _getter = (args) => {
  return !args.length || !args[0];
};

export default {
  log: _log,
  clampAngle: _clampAngle,
  toDeg: _toDeg,
  toRad: _toRad,
  fix: _fix,
  uuid: _uuid,
  rndBetween: _rndBetween,
  getter: _getter
};
