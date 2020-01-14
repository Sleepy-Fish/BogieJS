const _toDeg = (rad) => {
  return _clampAngle(rad * (180 / Math.PI));
};

const _toRad = (deg) => {
  return deg * (Math.PI / 180);
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

export default {
  clampAngle: _clampAngle,
  toDeg: _toDeg,
  toRad: _toRad,
  uuid: _uuid
};
