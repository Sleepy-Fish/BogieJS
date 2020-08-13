export const levels = {
  VERBOSE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
};

export const colors = {
  VERBOSE: '\x1b[34m%s\x1b[0m', // Blue
  DEBUG: '\x1b[32m%s\x1b[0m', // Green
  INFO: '\x1b[36m%s\x1b[0m', // Cyan
  WARN: '\x1b[33m%s\x1b[0m', // Yellow
  ERROR: '\x1b[31m%s\x1b[0m' // Red
};

export default {
  LEVEL: levels.VERBOSE,
  PRECISION: 10
};
