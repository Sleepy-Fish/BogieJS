import C, { levels, colors } from './constants';

const _log = (msg: string, level: number | string = levels.INFO): void => {
  const key: string = (typeof (level) === 'string')
    ? level.toUpperCase()
    : Object.keys(levels).find(k => levels[k] === level) ?? '';
  if (levels[key] >= C.LEVEL) console.info(colors[key], `${key}:`, msg);
};

const _toDeg = (rad: number): number => {
  return _clampAngle(rad * (180 / Math.PI));
};

const _toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const _fix = (value: number, precision: number = C.PRECISION): number => {
  return Number(value.toFixed(precision));
};

const _clampAngle = (angle: number): number => {
  if (angle > 360) return _clampAngle(angle - 360);
  if (angle < 0) return _clampAngle(angle + 360);
  return angle;
};

const _uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const replace = Math.random() * 16 | 0;
    const output = (char === 'x') ? replace : (replace & 0x3 | 0x8);
    return output.toString(16);
  });
};

export default {
  log: _log,
  clampAngle: _clampAngle,
  toDeg: _toDeg,
  toRad: _toRad,
  fix: _fix,
  uuid: _uuid,
};
